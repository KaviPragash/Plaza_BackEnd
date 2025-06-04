const Business = require("../models/business");


exports.addBusiness = async (req, res) => {
    try{
        const {business_name, description} = req.body;

        if (!business_name){
            return res.status(400).json({message: "Business Name not found"})
        }

        const business = await Business.create({
            business_name, description
        });

        res.status(200).json({message: "Business Added Sucessfully"})
    }
    catch(error){
        return res.status(404).json({message: "internal server Error", error: error.message})
    }
}

exports.getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.findAll();
        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getBusinessByCode = async (req, res) => {
    try {
        const { business_code } = req.params;

        const business = await Business.findByPk(business_code);

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateBusiness = async (req, res) => {
    try {
        const { business_code } = req.params;
        const { business_name, description } = req.body;

        const business = await Business.findByPk(business_code);

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        await business.update({
            business_name: business_name || business.business_name,
            description: description || business.description
        });

        res.status(200).json({ message: "Business updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.deleteBusiness = async (req, res) => {
    try {
        const { business_code } = req.params;

        const business = await Business.findByPk(business_code);

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        await business.destroy();
        res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
