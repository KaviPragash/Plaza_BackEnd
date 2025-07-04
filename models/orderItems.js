const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");

const OrderItems = sequelize.define('OrderItems', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.UUID, allowNull: false },
    variant_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.FLOAT, allowNull: false }
}, {
    timestamps: true,
    tableName: 'OrderItems',
});

OrderItems.belongsTo(Order, { foreignKey: 'order_id' });
module.exports = OrderItems;