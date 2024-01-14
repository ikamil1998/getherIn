"use strict";
const express = require("express");
const dashboardController = require("../../controllers/dashboard");
const dashboardValidations = require("../../validations/dashboard");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.post('/set', isAuth, [...dashboardValidations.set], dashboardController.setPrivacy)
module.exports = router;
