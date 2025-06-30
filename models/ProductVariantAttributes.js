const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductVariants = require("./productVariants");

const ProductVariantAttributes = sequelize.define("ProductVariantAttributes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productVarient_code: {
    type: DataTypes.STRING,
    // references: {
    //     model: ProductVariants,
    //     key: "productVarient_code"
    // },
    allowNull: false
},
    attribute_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attribute_value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: "ProductVariantAttributes"
});

module.exports = ProductVariantAttributes;
