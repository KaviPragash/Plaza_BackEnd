const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const MainCategory = sequelize.define("MainCategory", {
    mCategory_code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    mCategory_name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
},{
    timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
    tableName: 'MainCategory', // Explicitly define the table nam
});

// Auto-generate custom ID before creating a user
MainCategory.beforeCreate(async (Maincategory) => {
    const lastMcate = await MainCategory.findOne({
        order: [["mCategory_code", "DESC"]],
    });

    let newId = "MC001"; // Default first ID

    if (lastMcate) {
        const lastIdNumber = parseInt(lastMcate.mCategory_code.replace("MC", ""), 10);
        newId = `MC${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    Maincategory.mCategory_code = newId;
});

module.exports = MainCategory;