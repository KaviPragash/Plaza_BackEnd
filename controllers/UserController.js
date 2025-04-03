const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { use } = require("../routes/userRoutes");


// ✅ Register User
exports.register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user data
        const userData = {
            email,
            password: hashedPassword,
            full_name,
        };

        // Create the user
        await User.create(userData);

        // Return success response
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Validation Error Details:", error.errors); // Log validation errors
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({message: "Email and password are required"})
    }

    const user= await User.findOne({where: {email}});

    if (!user){
        return res.status(401).json({message: "Invalid Email or Email not Found"})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        "your_jwt_secret",
        { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, 
        user:{
            userId: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        } });
    }
catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}
}