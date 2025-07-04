// routes/imageRoutes.js

const express = require("express");
const router = express.Router();
const Img = require("../controllers/imgController");

router.post("/img", Img.uploadImg);

module.exports = router;
