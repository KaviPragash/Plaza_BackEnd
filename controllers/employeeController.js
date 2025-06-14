const { Sequelize, where } = require("sequelize");
const Employee = require("../models/employee");
const Shops = require("../models/shops");

exports.AddEmployee = async (req, res) => {
    try{
        const {father_name, full_name, nic_no, mobile_tp, home_tp, family_member_tp, address, image_url, email,
            employment_start_date, shop_id
        } = req.body;;

        if (!full_name || !mobile_tp || !address){
            return res.status(400).json ({message: "Full name , Mobile number and Adress Must needed"})
        }

        const ShopIdExites = shop_id ? await Shops.findByPk(shop_id): null;
        if (shop_id && !ShopIdExites){
            return res.status(400).json({message: "Invalid Shop id"})
        }
        
        const employee = await Employee.create({father_name, full_name, nic_no, mobile_tp, home_tp, family_member_tp, address, image_url, email,
            employment_start_date, shop_id})

        res.status(200).json({message: "Employee details Added Succussfully"})
    }
    catch(error){
        return res.status(404).json({message: "internal server error", error: error.message})
    }
}

exports.GetAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            attributes: [
                "employee_code",
                "father_name",
                "full_name",
                "nic_no",
                "mobile_tp",
                "home_tp",
                "family_member_tp",
                "address",
                "image_url",
                "email",
                "employment_start_date",
            ],
            include: [
               { model: Shops,
                attributes: ["id", "shop_name"]
            } 

            ]
        });
        res.status(200).json({ employees });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.GetEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id, {
            attributes: [
                "employee_code",
                "father_name",
                "full_name",
                "nic_no",
                "mobile_tp",
                "home_tp",
                "family_member_tp",
                "address",
                "image_url",
                "email",
                "employment_start_date",
            ],
            include: [{
                model: Shops,
                attributes: ["id", "shop_name"]
            }]
        });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ employee });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.UpdateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            father_name,
            full_name,
            nic_no,
            mobile_tp,
            home_tp,
            family_member_tp,
            address,
            image_url,
            email,
            employment_start_date,
            shop_id
        } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (shop_id) {
            const shopExists = await Shops.findByPk(shop_id);
            if (!shopExists) {
                return res.status(400).json({ message: "Invalid Shop ID" });
            }
        }

        await employee.update({
            father_name,
            full_name,
            nic_no,
            mobile_tp,
            home_tp,
            family_member_tp,
            address,
            image_url,
            email,
            employment_start_date,
            shop_id
        });

        res.status(200).json({ message: "Employee updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.DeleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await employee.destroy();

        res.status(200).json({ message: "Employee deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
