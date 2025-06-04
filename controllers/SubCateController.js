const { Sequelize } = require("sequelize");
const MainCategory = require("../models/MainCategory");
const SubCategory = require("../models/SubCategory");


exports.addSubcategory = async (req, res) => {
    try {
        const { SCategory_name, MainCategory_code } = req.body;

        if (!MainCategory_code) {
            return res.status(404).json({ message: "Main Category code not Available" });
        }

        // const SCateNameLower = SCategory_name.toLowerCase();

        // const existingSCate = await SubCategory.findOne({
        //     where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('SCategory_name')), SCateNameLower)
        // });

        // if (existingSCate) {
        //     return res.status(400).json({ message: "Sub Category Already Exists" });
        // }

        await SubCategory.create({ SCategory_name, MainCategory_code });

        return res.status(200).json({ message: "Sub Category Added Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getallSubCategory = async(req, res) => {
    try{
        const SCate = await SubCategory.findAll({
            attributes: ["SCategory_code",
                "SCategory_name"],
                include: [
                    {
                        model: MainCategory,
                        attributes: ["mCategory_code","mCategory_name"]
    
                    }
                ]
        })
        return res.status(200).json(SCate)
    }
    catch(error){
        res.status(500).json({
            message: "internal Server Error", Errpr: error.message
        })
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const { SCategory_code, SCategory_name, MainCategory_code } = req.body;

        if (!SCategory_name) {
            return res.status(400).json({ message: "Sub Category name is required" });
        }

        const updateScate = await SubCategory.findOne({ where: { SCategory_code } });

        if (!updateScate) {
            return res.status(404).json({ message: "Sub Category not found" });
        }

        if (MainCategory_code) {
            const mCateExists = await MainCategory.findByPk(MainCategory_code);
            if (!mCateExists) {
                return res.status(404).json({ message: "Invalid Main Category ID" });
            }
        }

        await updateScate.update({ SCategory_name, MainCategory_code });

        return res.status(200).json({ message: "Sub Category updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.DeleteSubCategory= async (req, res) => {
    try{
        const {SubCategory_code} = req.body;

        if(!SubCategory_code) {
            res.status(404).json({message: "Sub Category ID not found"})
        }

        const DeleteCate = await SubCategory.findOne({where: {SCategory_code: SubCategory_code}})

        if (!DeleteCate){
            return res.status(404).json({message: "Invalid Sub Category ID"})
        }

        await DeleteCate.destroy(SubCategory_code)
        return res.status(200).json({message: "SubCategory Deleted Successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", Error: error.message})
    }
}