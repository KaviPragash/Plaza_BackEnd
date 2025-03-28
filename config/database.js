require("dotenv").config(); // Load environment variables

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Set true if you want query logs
});

module.exports = sequelize;