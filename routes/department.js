"use strict";
// ! don't forget validation
const express = require("express");
const departmentValidation = require("../validations/department");
const departmentController = require("../controllers/department");
const isAuth = require("../middleware/is-auth");
const Model = require("../models");

const router = express.Router();

router.get("/get/all", isAuth, departmentController.getAll);
router.get(
  "/get/:id",
  isAuth,
  [...departmentValidation.checkIdParam],
  departmentController.get
);

router.post(
  "/create",
  isAuth,
  [...departmentValidation.create],
  departmentController.create
);
router.post(
  "/update",
  isAuth,
  [...departmentValidation.update],
  departmentController.update
);
router.post(
  "/delete",
  isAuth,
  [...departmentValidation.checkId],
  departmentController.delete
);
router.post(
  "/user/add",
  isAuth,
  [...departmentValidation.checkCode],
  departmentController.addUser
);
router.post(
  "/user/remove",
  isAuth,
  [...departmentValidation.userMangment],
  departmentController.removeUser
);
router.get(
  "/:id/users/get",
  isAuth,
  departmentController.getUsersInDerpartment
);
router.get("/test", async (req, res) => {
  const department = await Model.Department.findByPk(18)
  department.url = "hacker"
  department.save()
  res.send(department.url)
})
router.get("/search/users",isAuth,departmentController.filterUsers)

module.exports = router;
