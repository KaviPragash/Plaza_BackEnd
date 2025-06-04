const express = require("express");
const router = express.Router();

const businessController = require("../controllers/businessController")

router.post("/addBusiness", businessController.addBusiness);
router.get("/getBusiness", businessController.getBusinesses);
router.get("/getBusinessbyCode/:business_code", businessController.getBusinessByCode);
router.put("/UpdatebBusiness/:business_code", businessController.updateBusiness);
router.delete("/Deletebusiness/:business_code", businessController.deleteBusiness);

module.exports = router;
