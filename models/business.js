const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Business = sequelize.define("Business", {
    business_code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull:false
    },
},{
    timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
    tableName: 'Business', // Explicitly define the table nam
});

// Auto-generate custom ID before creating a user
Business.beforeCreate(async (business) => {
    const lastBusiness_code = await Business.findOne({
        order: [["business_code", "DESC"]],
    });

    let newId = "BS001"; // Default first ID

    if (lastBusiness_code) {
        const lastIdNumber = parseInt(lastBusiness_code.business_code.replace("BS", ""), 10);
        newId = `BS${String(lastIdNumber + 1).padStart(3, "0")}`;
    }

    business.business_code = newId;
});

module.exports = Business;