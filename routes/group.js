"use strict";
// ! don't forget validation
const express = require("express");
const groupValidation = require("../validations/group");
const groupController = require("../controllers/group");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
router.get("/get/all", isAuth, groupController.getAll)
router.get("/get/department/:id", isAuth, groupController.getByDepartmentId);
router.get(
  "/get/:id",
  isAuth,
  [...groupValidation.checkId],
  groupController.get
);
router.post(
  "/create",
  isAuth,
  [...groupValidation.create],
  groupController.create
);
router.post("/update", isAuth, groupController.update);
router.post(
  "/delete",
  isAuth,
  [...groupValidation.checkName],
  groupController.delete
);

router.post(
  "/users/add",
  isAuth,
  [...groupValidation.userMangment],
  groupController.addUsers
);
router.post(
  "/users/delete",
  isAuth,
  [...groupValidation.userMangment],
  groupController.deleteUsers
);
router.post(
  "/change/leader",
  isAuth,
  [...groupValidation.leader],
  groupController.changeLeader
);
router.get('/get/last/question/:id',isAuth,groupController.GetLastQuestion)
module.exports = router;
