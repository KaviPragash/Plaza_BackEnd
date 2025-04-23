const Order = require("../models/order");


exports.AddORDER = async (req,res) => {
    try{
        const {cashier_id,
            total_amount} = req.body;

        await Order.create({ 
            cashier_id,
            total_amount
        });

        res.status(200).json({Message: "Orded Added"})
    }
    catch(error){
        return res.status(500).json({message: "Internal server Error", error: error.message})
    }
}