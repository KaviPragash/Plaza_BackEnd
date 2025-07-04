const Order = require("../models/order");
const sequelize = require("../config/database"); // adjust path if needed
const OrderItem = require ("../models/orderItems")
const StockBatch = require("../models/StockBatches");
const ProductVariants = require("../models/productVariants");
const { Op } = require("sequelize");


exports.AddORDER = async (req, res) => {
  try {
    const { cashier_id, total_amount } = req.body;

    await Order.create({
      cashier_id,
      total_amount,
    });

    res.status(200).json({ Message: "Orded Added" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server Error", error: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  const { cashier_id, items } = req.body;
  const t = await sequelize.transaction();

  try {
    let total = 0;

    // 1. Create Order
    const order = await Order.create(
      { cashier_id, total_amount: 0 },
      { transaction: t }
    );

    for (const item of items) {
      const { variant_id, quantity } = item;

      // 2. Get selling price from ProductVariant
      const variant = await ProductVariants.findByPk(variant_id, {
        transaction: t,
      });
      if (!variant) {
        throw new Error(`Product variant not found: ${variant_id}`);
      }

      const unit_price = variant.discount_sellingPrice;
      total += quantity * unit_price;

      // 3. Insert Order Item
        await OrderItem.create(
          {
            order_id: order.id,
            variant_id,
            quantity,
            unit_price,
          },
          { transaction: t }
        );

      // 4. Deduct stock from FIFO batches
      let remainingQty = quantity;

      const batches = await StockBatch.findAll({
        where: {
          variant_id,
          quantity: { [Op.gt]: 0 },
        },
        order: [["createdAt", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const batch of batches) {
        if (remainingQty === 0) break;

        const deductQty = Math.min(batch.quantity, remainingQty);
        batch.quantity -= deductQty;
        remainingQty -= deductQty;
        await batch.save({ transaction: t });
      }

      if (remainingQty > 0) {
        throw new Error(`Insufficient stock for variant ${variant_id}`);
      }
    }

    // 5. Update total
    order.total_amount = total;
    await order.save({ transaction: t });

    await t.commit();
    res
      .status(200)
      .json({ message: "Order placed successfully", order_id: order.id });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'order_items', // use correct alias if you've defined it
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

