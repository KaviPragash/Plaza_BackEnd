const { DataTypes} = require("sequelize");
const sequelize = require("../config/database")
const AdminUser = require("../models/AdminUser");
const Business = require("./business");

const Shops = sequelize.define("Shops",{
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: AdminUser,
            key: "id",
        },
        allowNull: true,
    },
    business_code: {
        type: DataTypes.STRING,
        references: {
            model: Business,
            key: "business_code",
        },
        allowNull: true,
    },
    shop_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_number:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
    tableName: 'Shops', // Explicitly define the table nam
});

// Associations
Shops.belongsTo(AdminUser, { foreignKey: "owner_id" });
Shops.belongsTo(Business, { foreignKey: "business_code" });

// Auto-generate custom ID before creating a user
Shops.beforeCreate(async (shops) => {
    const lastShop = await Shops.findOne({
        order: [["id", "DESC"]],
    });

    let newId = "SH001"; // Default first ID

    if (lastShop) {
        const lastIdNumber = parseInt(lastShop.id.replace("SH", ""), 10);
        newId = `SH${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    shops.id = newId;
});

module.exports = Shops;