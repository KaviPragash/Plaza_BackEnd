const { where } = require("sequelize");
const AdminUser = require("../models/AdminUser");
const Shops = require("../models/shops");


exports.add_shop = async (req, res) => {
    try{
        const{
            owner_id,
            shop_name,
            description,
            image_url,
            location,
            contact_number,
            email
        } = req.body;

        if (!shop_name){
            return res.status(400).json({message: "Shop name is Required"});
        }

        const OwnerExites = owner_id ? await AdminUser.findByPk(owner_id) : null;

        if (owner_id && !OwnerExites){
            return res.status(400)({message: "Invalid ShowOwener ID"})
        }

        const shops = await Shops.create({
            owner_id,
            shop_name,
            description,
            image_url,
            location,
            contact_number,
            email
        });

        res.status(200).json({message: "Shops Added Successfully", shops})
    }
    catch(error){ 
        res.status(500).json({message: "Internal server Error", error: error.message})
    }
}

exports.GetShops = async (req, res) => {
    try{
        const shopDetails = await Shops.findAll({
            attributes: [
                "id",
                "shop_name",
                "description",
                "image_url",
                "location",
                "contact_number",
                "email",
                "owner_id"
            ],
            include: [
                {
                    model: AdminUser,
                    attributes: ["id","full_name"]

                }
            ]
        });
        return res.status(200).json({message: "Shops Details Retrived Successfully",
            shopDetails
        });
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });

    }
};

exports.updateShop = async (req, res) => {
    try{
        const {id} = req.params;
        const {
            owner_id,
            shop_name,
            description,
            image_url,
            location,
            contact_number,
            email
        } = req.body;

        const shops = await Shops.findOne({where: { id: id}})
         if (!shops){
            return res.status(404).json({message: "Shop not found"});
         }

         const OwnerExites = owner_id ? await AdminUser.findByPk(owner_id) : null;

        if (owner_id && !OwnerExites){
            return res.status(400)({message: "Invalid ShowOwener ID"})
        }

        await shops.update({
            owner_id,
            shop_name,
            description,
            image_url,
            location,
            contact_number,
            email
        });

        return res.status(200).json({message: "ShopDetails updated Successfully"})
    }
    catch(error){
        res.status(500).json({message: "internal Server Error", error: error.message})

    }
};

exports.deleteShops = async (req, res) => {
    try{
        const {id} = req.params;
        
        const shops = await Shops.findOne({where: { id: id}})
        if (!shops){
            return res.status(404).json({message: "Shops not found"})
        }
        await Shops.destroy({where: {id: id}});
        res.status(200).json ({message: "Shop Details deleted successfully"});
    }
    catch(error){
        res.status(500).json ({message: "internal server error", error: error.message})
    }
}