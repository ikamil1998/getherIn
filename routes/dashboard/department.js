"use strict";
const express = require("express");
const dashboardController = require("../../controllers/dashboard");
const dashboardValidations = require("../../validations/dashboard");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.post('/delete/user', isAuth,dashboardController.deleteUser)
router.post('/add/user', isAuth,dashboardController.addUser)
router.get('/:id/get/all/users', isAuth,dashboardController.getAllUserInDepartment)
router.get('/get/all', isAuth,dashboardController.getAllDepartment)
router.get('/get/all/:userId', isAuth,dashboardController.getAllDepartmentForUser)
module.exports = router;
