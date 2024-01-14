"use strict";
// ! don't forget validation
const express = require("express");
const complaintValidation = require("../validations/complaint");
const complaintController = require("../controllers/complaint");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/get/all",isAuth,complaintController.getAll)
router.get("/get/:id",isAuth,complaintController.getByUserId)
router.post("/create",isAuth,[...complaintValidation.create],complaintController.create)
// router.post("/update",isAuth,[...complaintValidation.update],complaintController.create)
router.post("/update",isAuth,complaintController.update)
// router.post("/create",isAuth,[...complaintValidation.delete],complaintController.delete)
router.post("/delete",isAuth,complaintController.delete)

module.exports = router;
