const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Shops = require("./shops");

const Employee = sequelize.define(
  "Employee",
  {
    employee_code: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    father_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nic_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mobile_tp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    home_tp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    family_member_tp: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image_url: {
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
    employment_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    shop_id: {
        type: DataTypes.STRING,
        references: {
            model: Shops,
            key: "id"
        },
        allowNull: true,
    },
  },
  {
    timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
    tableName: "Employee", // Explicitly define the table name
  }
);

Employee.belongsTo(Shops, { foreignKey: "shop_id" });

// Auto-generate custom ID before creating a SubCategory
Employee.beforeCreate(async (Employees) => {
  const lastEmployee = await Employee.findOne({
    order: [["employee_code", "DESC"]], // Fixed case-sensitive column name
  });

  let newId = "EMP001"; // Default first ID

  if (lastEmployee) {
    const lastIdNumber = parseInt(
      lastEmployee.employee_code.replace("EMP", ""),
      10
    );
    newId = `EMP${String(lastIdNumber + 1).padStart(3, "0")}`;
  }

  Employees.employee_code = newId; // Fixed case-sensitive assignment
});

module.exports = Employee;
