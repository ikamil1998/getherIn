"use strict";
// ! don't forget validation
const express = require("express");
// const complaintValidation = require("../validations/complaint");
const IAPController = require("../controllers/IAP");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/apple/get-notify/notification", IAPController.getNotificationFromApple)
router.post("/google/get/notification", IAPController.getNotificationFromGooglePlay)
router.post("/save/receipt", isAuth, IAPController.saveReceipt)
router.get("/test", IAPController.test)

module.exports = router;
