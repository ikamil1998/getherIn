"use strict";
const express = require("express");
const dashboardController = require("../../controllers/dashboard");
const isAuth = require("../../middleware/is-auth");
const ValidationDashboard = require("../../validations/dashboard");
const router = express.Router();

router.get(
    "/info",
    isAuth,
    dashboardController.info
);
// router.post('/about/set', isAuth, dashboardController.setAbout)
// router.post('/privacy/set', isAuth, dashboardController.setPrivacy)
// router.post("", [...ValidationUser.create], dashboardController.createAdmin)
module.exports = router;
