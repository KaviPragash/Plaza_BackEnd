const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminUser = sequelize.define('AdminUser', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['cashier', 'admin', 'shop']], // Enforce role validation
        },
        defaultValue: "admin",
    },
}, {
    timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
    tableName: 'AdminUsers', // Explicitly define the table name
});

module.exports = AdminUser;