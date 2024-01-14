"use strict";
const express = require("express");
const dashboardController = require("../../controllers/dashboard");
const dashboardValidation = require("../../validations/dashboard");

const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.post('/create', isAuth, [...dashboardValidation.create], dashboardController.createAdmin)
router.post('/delete', isAuth, dashboardController.deleteAdmin)

module.exports = router;
