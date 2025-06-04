const { Sequelize, where } = require("sequelize");
const MainCategory = require("../models/MainCategory");


exports.addMaincategory = async (req, res) => {
    try {
        const { mCategory_name } = req.body;

        if (!mCategory_name) {
            return res.status(404).json({ message: "Main Category Name not Available" });
        }

        const MCateNameLower = mCategory_name.toLowerCase();

        const existingMCate = await MainCategory.findOne({
            where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mCategory_name')), MCateNameLower)
        });

        if (existingMCate) {
            return res.status(400).json({ message: "Main Category Already Exists" });
        }

        await MainCategory.create({ mCategory_name });

        return res.status(200).json({ message: "Main Category Added Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getallMCategory = async(req, res) => {
    try{
        const MCate = await MainCategory.findAll({
            attributes: ["mCategory_code",
                "mCategory_name"]
        })
        return res.status(200).json(MCate)
    }
    catch(error){
        res.status(500).json({
            message: "internal Server Error", Errpr: error.message
        })
    }
};

exports.updateMCategory = async(req, res) => {
    try{
        const {mCategory_code, mCategory_name} = req.body;

        if (!mCategory_name){
            return res.status(404).json({message: "update Main Catrgory name not found"});
        }

        const UpdateMcate = await MainCategory.findOne({where: {mCategory_code: mCategory_code}})

        if (!UpdateMcate){
            return res.status(404).json({message: "Invalid Category"})
        }

        await UpdateMcate.update({mCategory_name});

        return res.status(200).json({message: "Main Category updated Successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal Server error", Error: error.message})
    }
}

exports.DeleteMCategory= async (req, res) => {
    try{
        const {mCategory_code} = req.body;

        if(!mCategory_code) {
            res.status(404).json({message: "Main Category ID not found"})
        }

        const DeleteCate = await MainCategory.findOne({where: {mCategory_code: mCategory_code}})

        if (!DeleteCate){
            return res.status(404).json({message: "Invalid Main Category ID"})
        }

        await DeleteCate.destroy(mCategory_code)
        return res.status(200).json({message: "MainCategory Deleted Successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", Error: error.message})
    }
}