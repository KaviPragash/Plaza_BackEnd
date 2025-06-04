const express = require("express");
const router = express.Router();

const {AddProducts, AddProductsVariants, getAllProducts, AddStockBatches, UpdateProductVarient,
    updateProducts, GetProductbyBarcode, AddDiscount, ActivateDiscount } = require("../controllers/ProductController")

router.post("/AddProducts", AddProducts);
router.post("/AddProductsVariants", AddProductsVariants);
router.post("/AddStockBatches", AddStockBatches)
router.get("/GetAllProducts", getAllProducts)
router.get("/GetProductbyBarcode/:barcode", GetProductbyBarcode)
router.put("/UpdateProductVarient",UpdateProductVarient)
router.put("/updateProducts",updateProducts)
router.put("/AddDiscount", AddDiscount)
router.put("/ActivateDiscount", ActivateDiscount)

module.exports = router;