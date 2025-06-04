const express = require("express");
const router = express.Router();

const {Adminregister, Adminlogin} = require("../controllers/adminController")

router.post("/Adminregister", Adminregister);
router.post("/Adminlogin", Adminlogin);

module.exports = router;
