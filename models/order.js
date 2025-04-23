const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define('Order', {
    id: { type: DataTypes.STRING, primaryKey: true},
    cashier_id: { type: DataTypes.STRING, allowNull: false },
    total_amount: { type: DataTypes.FLOAT, allowNull: false },
}, {
    timestamps: true,
    tableName: 'Order',
});

Order.beforeCreate(async (order) => {
    const lastOrder = await Order.findOne({
        order: [["id", "DESC"]],
    });

    let newId = "ORD001";

    if (lastOrder){
        const lastIdNumber = parseInt(lastOrder.id.replace("ORD",""),10);
        newId = `ORD${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    order.id = newId;
})

module.exports = Order;