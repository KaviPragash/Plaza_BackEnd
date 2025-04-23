const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductVariants = require("./productVariants");

const StockBatches = sequelize.define("StockBatches", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    variant_id: {
        type: DataTypes.STRING,
        references: {
            model: ProductVariants,
            key: "productVarient_code"
        },
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantityType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    base_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    received_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: true,
    tableName: "StockBatches",
});

StockBatches.belongsTo(ProductVariants, { foreignKey: "variant_id" });
ProductVariants.hasMany(StockBatches, { foreignKey: "variant_id" });

module.exports = StockBatches;
