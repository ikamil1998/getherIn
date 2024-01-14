"use strict";
// ! don't forget validation
const express = require("express");
const complaintValidation = require("../validations/chatComplaint");
const complaintController = require("../controllers/chatComplaint");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/get/all", isAuth, complaintController.getAll)
router.get("/get/:id", isAuth, complaintController.getById)
router.post("/create", isAuth, [...complaintValidation.create], complaintController.create)
router.post("/update", isAuth, complaintController.update)
router.post("/delete", isAuth, complaintController.delete)

module.exports = router;
