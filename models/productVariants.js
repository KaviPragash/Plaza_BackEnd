const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Products = require("./products");

const ProductVariants = sequelize.define("ProductVariants", {
    productVarient_code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    product_code: {
        type: DataTypes.STRING,
        references: {
            model: Products,
            key: "product_code"
        },
        allowNull: false,
    },
    barcode: {
        type: DataTypes.STRING,
        unique: true, // Ensure barcodes are unique
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selling_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "ProductVariants",
});

// Auto-generate custom ID before creating a SubCategory
ProductVariants.beforeCreate(async (Productvarient) => {
    const lastProductvarient = await ProductVariants.findOne({
        order: [["productVarient_code", "DESC"]], // Fixed case-sensitive column name
    });

    let newId = "PV001"; // Default first ID

    if (lastProductvarient) {
        const lastIdNumber = parseInt(lastProductvarient.productVarient_code.replace("PV", ""), 10);
        newId = `PV${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    Productvarient.productVarient_code = newId; // Fixed case-sensitive assignment
});

ProductVariants.belongsTo(Products, { foreignKey: "product_code" });;


module.exports = ProductVariants;
