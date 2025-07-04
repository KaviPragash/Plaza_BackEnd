const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    cashier_id: { type: DataTypes.STRING, allowNull: true },
    total_amount: { type: DataTypes.FLOAT, allowNull: true },
}, {
    timestamps: true,
    tableName: 'orders',
});

module.exports = Order;