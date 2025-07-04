const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const Shops = require("./shops");
const MainCategory = require("./MainCategory");
const SubCategory = require("./SubCategory");

const Products = sequelize.define("Products",{
    product_code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    shop_id: {
        type: DataTypes.STRING,
        references: {
            model: Shops,
            key: "id"
        },
        allowNull: true,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mCategory_code: {
        type: DataTypes.STRING,
        references: {
            model: MainCategory,
            key: "mCategory_code"
        },
        allowNull: true,
    },
    sCategory_code: {
        type: DataTypes.STRING,
        references: {
            model: SubCategory,
            key: "SCategory_code"
        },
        allowNull: true,
    },
    product_description: {
        type: DataTypes.STRING,
        allowNull:false
    },
},{
    timestamps: true, // Explicitly disable timestamps
    tableName: 'Products',
});

Products.belongsTo(Shops, { foreignKey: "id" });
Products.belongsTo(MainCategory, { foreignKey: "mCategory_code" });
Products.belongsTo(SubCategory, { foreignKey: "SCategory_code" });

// Auto-generate custom ID before creating a SubCategory
Products.beforeCreate(async (Product) => {
    const lastProduct = await Products.findOne({
        order: [["product_code", "DESC"]], // Fixed case-sensitive column name
    });

    let newId = "PC001"; // Default first ID

    if (lastProduct) {
        const lastIdNumber = parseInt(lastProduct.product_code.replace("PC", ""), 10);
        newId = `PC${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    Product.product_code = newId; // Fixed case-sensitive assignment
});

module.exports = Products;