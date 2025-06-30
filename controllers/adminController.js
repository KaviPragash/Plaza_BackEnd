const bcrypt = require("bcrypt");
const AdminUser = require("../models/AdminUser");
const jwt = require("jsonwebtoken");
const axios = require("axios");


// ✅ Register User
exports.Adminregister = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the email already exists in the database
        const existingUser = await AdminUser.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user data
        const AdminUserData = {
            email,
            password: hashedPassword,
            full_name,
            role
        };

        // Create the user
        await AdminUser.create(AdminUserData);

        // Return success response
        res.status(201).json({ message: "Admin or ShopAdmin registered successfully" });
    } catch (error) {
        console.error("Validation Error Details:", error.errors); // Log validation errors
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.Adminlogin = async(req, res) => {
    try {
        const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({message: "Email and password are required"})
    }

    const Adminuser= await AdminUser.findOne({where: {email}});

    if (!Adminuser){
        return res.status(401).json({message: "Invalid Email or Email not Found"})
    }

    const isMatch = await bcrypt.compare(password, Adminuser.password);

    if (!isMatch){
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
  {
    id: Adminuser.id,
    email: Adminuser.email,
    role: Adminuser.role, // include the role
  },
  "your_jwt_secret", // better to use env var
  { expiresIn: "1h" }
);

    res.json({ message: "Login successful", token, 
        Adminuser:{
            id: Adminuser.id,
            full_name: Adminuser.full_name,
            email: Adminuser.email,
            role: Adminuser.role
        } });
    }
catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}}