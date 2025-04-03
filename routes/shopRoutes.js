const express = require("express");
const router = express.Router();

const {add_shop, GetShops, updateShop, deleteShops} = require("../controllers/ShopController")

router.post("/add_shop", add_shop);
router.get("/GetShops", GetShops);
router.put("/updateShop/:id", updateShop)
router.delete("/deleteShops/:id", deleteShops)

module.exports = router;
