const express = require("express");
const router = express.Router();

const {AddORDER} = require("../controllers/PlaceOrderController")

router.post("/AddORDER", AddORDER);

module.exports = router;
