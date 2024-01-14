"use strict";
const { body, param } = require("express-validator");
const Model = require("../models");

exports.data = [
  body("name", "name is not exsist").notEmpty(),
  body("type", "tyep is not exsist").notEmpty(),
  body("image", "image is not exsist").notEmpty(),
  body("price", "price not exsist")
    .notEmpty()
    .withMessage("price not exsist")
    .isInt({ min: 0 })
    .withMessage("price must be positive nubmer"),
  body("expiry")
    .notEmpty()
    .withMessage("expiry not exsist")
    .isFloat({min:0.9})
    .withMessage("expiry must be greater then 0"),
  body("number_of_department")
    .notEmpty()
    .withMessage("number_of_department not exsist")
    .isInt({ min: 1 })
    .withMessage("number_of_department must be positive nubmer"),
];
exports.update = [];
exports.id = [
  body("id")
    .notEmpty()
    .withMessage("Please enter a ID.")
    .custom(async (value, { req }) => {
      return Model.Package.findOne({ where: { id: value } }).then((data) => {
        if (!data) {
          return Promise.reject("A package is not exists!");
        }
      });
    }),
];
exports.buy = [
  body("packageId")
    .notEmpty()
    .withMessage("packageID not exsist")
    .custom((value, { req }) => {
      return Model.Package.findOne({
        raw: true,
        where: { id: value },
        attributes: ["name", "number_of_department", "number_of_group", "id"],
      }).then((res) => {
        if (!res) {
          return Promise.reject("Pakage is not exists");
        } else {
          req.packageName = res.name;
          req.number_of_department = res.number_of_department;
          req.number_of_group = res.number_of_group;
        }
      });
    }),
];
