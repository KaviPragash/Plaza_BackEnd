const express = require("express");
const router = express.Router();

const {AddProducts, AddProductsVariants, getAllProducts, AddStockBatches, UpdateProductVarient,updateProducts } = require("../controllers/ProductController")

router.post("/AddProducts", AddProducts);
router.post("/AddProductsVariants", AddProductsVariants);
router.post("/AddStockBatches", AddStockBatches)
router.get("/GetAllProducts", getAllProducts)
router.put("/UpdateProductVarient",UpdateProductVarient)
router.put("/updateProducts",updateProducts)

module.exports = router;
