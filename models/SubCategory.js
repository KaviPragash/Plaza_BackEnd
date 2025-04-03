const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const MainCategory = require("./MainCategory");

const SubCategory = sequelize.define("SubCategory", {
    SCategory_code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    MainCategory_code: {
        type: DataTypes.STRING,
        references: {
            model: MainCategory,
            key: "mCategory_code", // Fixed: use a string
        },
        allowNull: true,
    },
    SCategory_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, // Explicitly disable timestamps
    tableName: 'SubCategory',
});

SubCategory.belongsTo(MainCategory, { foreignKey: "MainCategory_code" });

// Auto-generate custom ID before creating a SubCategory
SubCategory.beforeCreate(async (Subcategory) => {
    const lastScate = await SubCategory.findOne({
        order: [["SCategory_code", "DESC"]], // Fixed case-sensitive column name
    });

    let newId = "SC001"; // Default first ID

    if (lastScate) {
        const lastIdNumber = parseInt(lastScate.SCategory_code.replace("SC", ""), 10);
        newId = `SC${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    Subcategory.SCategory_code = newId; // Fixed case-sensitive assignment
});

module.exports = SubCategory;
