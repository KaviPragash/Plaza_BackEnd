const express = require("express");
const router = express.Router();

const Employee = require("../controllers/employeeController")

router.post("/addEmployee", Employee.AddEmployee);
router.get('/getallEmployee', Employee.GetAllEmployees);
router.get('/GetEmployeeById/:id', Employee.GetEmployeeById);
router.put('/UpdateEmployee/:id', Employee.UpdateEmployee);
router.delete('/DeleteEmployee/:id', Employee.DeleteEmployee)

module.exports = router;
