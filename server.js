require("dotenv").config();
require("./models/associations");
const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/database");

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/shopRoutes"));
app.use("/api/auth", require("./routes/mCateRoutes"));
app.use("/api/auth", require("./routes/SubCateRoutes"));
app.use("/api/auth", require("./routes/ProductRoutes"));
app.use("/api/auth", require("./routes/orderRoutes"));
app.use("/api/auth", require("./routes/businessRoutes"));
app.use("/api/auth", require("./routes/employeeRoutes"));
app.use("/api/auth", require("./routes/imgRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


sequelize
  .sync({ alter: true }) // Updates tables without dropping data
  .then(() => console.log("✅ Database & tables synced successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));


