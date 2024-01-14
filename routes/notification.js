const express = require("express");
const notificationController = require("../controllers/notification");
const notificationValidation = require("../validations/notification.js");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/get", isAuth, notificationController.getAll);
router.get("/get/pagination", isAuth, notificationController.getWithPg);
router.post("/change", isAuth, notificationController.change);
router.post("/send", isAuth, [...notificationValidation.send],notificationController.send);

module.exports = router;
