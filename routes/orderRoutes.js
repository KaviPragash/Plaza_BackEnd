const express = require("express");
const router = express.Router();

const {AddORDER, placeOrder} = require("../controllers/PlaceOrderController")

router.post("/AddORDER", AddORDER);
router.post("/placeOrder", placeOrder);

module.exports = router;
