const express = require("express");
const router = express.Router();

const {addMaincategory, getallMCategory, updateMCategory, DeleteMCategory} = require("../controllers/MainCateController")

router.post("/addMaincategory", addMaincategory);
router.get("/getallMCategory", getallMCategory);
router.put("/updateMCategory", updateMCategory);
router.delete("/DeleteMCategory", DeleteMCategory)

module.exports = router;
