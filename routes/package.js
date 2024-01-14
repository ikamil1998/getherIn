"use strict";
const express = require("express");
// data

const packageController = require("../controllers/package");
//
const isAuth = require("../middleware/is-auth");
//
const ValidationPackage = require("../validations/package");
const router = express.Router();
//! check if it's admin
router.post(
  "/create",
  isAuth,
  [...ValidationPackage.data],
  packageController.create
);
// ! for teacher  and admin
router.get("/get/all", isAuth, packageController.getAll);
router.get("/get/:id", isAuth, packageController.getById);
// ! for admin
router.post(
  "/update",
  isAuth,
  [...ValidationPackage.data,...ValidationPackage.id],
  packageController.update
);
// ! for admin
router.post(
  "/delete",
  isAuth,
  [...ValidationPackage.id],
  packageController.delete
);

//! for teacher
router.post(
  "/buy",
  isAuth,
  [...ValidationPackage.buy],
  packageController.BuyPackage
);

module.exports = router;
