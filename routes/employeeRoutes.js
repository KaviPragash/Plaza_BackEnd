const express = require("express");
const router = express.Router();

const Employee = require("../controllers/employeeController")

router.post("/addEmployee", Employee.AddEmployee);
router.get('/getallEmployee', Employee.GetAllEmployees);

module.exports = router;
