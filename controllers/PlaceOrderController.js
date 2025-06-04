const Order = require("../models/order");
const sequelize = require("../config/database"); // adjust path if needed
const OrderItem = require('../models/orderItems');
const StockBatch = require('../models/StockBatches');
const ProductVariants = require("../models/productVariants");


exports.AddORDER = async (req,res) => {
    try{
        const {cashier_id,
            total_amount} = req.body;

        await Order.create({ 
            cashier_id,
            total_amount
        });

        res.status(200).json({Message: "Orded Added"})
    }
    catch(error){
        return res.status(500).json({message: "Internal server Error", error: error.message})
    }
}


exports.placeOrder = async (req, res) => {
    const { cashier_id, items } = req.body; // items = [{variant_id, quantity}]
    const t = await sequelize.transaction();

    try {
        let total = 0;

        const order = await Order.create({ cashier_id, total_amount: 0 }, { transaction: t });

        for (const item of items) {
            const { variant_id, quantity } = item;

            // Get selling price from ProductVariant
            const variant = await ProductVariants.findByPk(variant_id, { transaction: t });
            if (!variant) {
                throw new Error(`Product variant not found: ${variant_id}`);
            }

            const unit_price = variant.selling_price;
            total += quantity * unit_price;

            // // Insert into OrderItem
            // await OrderItem.create({
            //     // order_id: String(order.id),
            //     variant_id: String(item.variant_id),
            //     quantity,
            //     unit_price
            //   }, { transaction: t });

            // Deduct stock from batches (FIFO)
            // let remainingQty = quantity;
            // const batches = await StockBatch.findAll({
            //     where: { variant_id, quantity: { [Op.gt]: 0 } },
            //     order: [['createdAt', 'ASC']],
            //     transaction: t,
            //     lock: t.LOCK.UPDATE
            // });

            // for (const batch of batches) {
            //     if (remainingQty === 0) break;

            //     const deductQty = Math.min(batch.quantity, remainingQty);
            //     batch.quantity -= deductQty;
            //     remainingQty -= deductQty;
            //     await batch.save({ transaction: t });
            // }

            // if (remainingQty > 0) {
            //     throw new Error(`Insufficient stock for variant ${variant_id}`);
            // }
        }

        // Finalize order total
        order.total_amount = total;
        await order.save({ transaction: t });

        await t.commit();
        res.status(200).json({ message: "Order placed successfully", order_id: order.id });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: "Failed to place order", error: err.message });
    }
};
