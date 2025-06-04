const express = require("express");
const router = express.Router();

const {addSubcategory, getallSubCategory, updateSubCategory, DeleteSubCategory} = require("../controllers/SubCateController")

router.post("/addSubcategory", addSubcategory);
router.get("/getallSubCategory", getallSubCategory);
router.put("/updateSubCategory", updateSubCategory);
router.delete("/DeleteSubCategory", DeleteSubCategory);

module.exports = router;
