"use strict";
const express = require("express");
const resultValidation = require("../validations/result");
const resultController = require("../controllers/result");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
router.get("/get/all", isAuth, resultController.getAll);
router.get("/get/department/:id", isAuth, resultController.getByDeapartmentId);
router.get(
  "/get/last/department/:id",
  isAuth,
  resultController.getLastResultByDeapartmentId
);
router.get("/get/:id", isAuth, resultController.getById);
router.post(
  "/create",
  isAuth,
  [...resultValidation.create],
  resultController.create
);

module.exports = router;
