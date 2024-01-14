"use strict";

const { body, param } = require("express-validator");
const { Department } = require("../models");
const { labels } = require("../intl");
const { makeCodeCode } = require("../utils")
exports.create = [
  body("name")
    .notEmpty()
    .withMessage("Please enter a name.")
    .custom(async (value, { req }) => {
      return Department.findOne({
        where: { name: value, userId: req.tokenUserId },
      }).then((department) => {
        if (department) {
          const lang = req.query.lang || "en";
          // console.log();
          return Promise.reject(labels["create_deaprtment_name"][lang]);
        }
      });
    }),
  // body("code")
  //   .custom(async (value, { req }) => {


  //     const re = new RegExp("^[A-Z0-9]+(?:List)?$");
  //     if (!re.test(value)) {
  //       const lang = req.query.lang || "en";
  //       return Promise.reject(labels["create_deaprtment_code_2"][lang]);
  //     }

  //     return true;
  //   })
  //   .custom(async (value, { req }) => {
  //     return Department.findOne({ where: { code: value } }).then(
  //       (department) => {
  //         if (department) {
  //           const lang = req.query.lang || "en";
  //           return Promise.reject(labels["create_deaprtment_code_1"][lang]);
  //         }
  //       }
  //     );
  //   }),
];
exports.checkId = [
  body("id")
    .notEmpty()
    .withMessage("Please enter a ID.")
    .custom(async (value, { req }) => {
      return Department.findOne({ where: { id: value } }).then((department) => {
        if (!department) {
          return Promise.reject("A department is not exists!");
        }
      });
    }),
];
exports.update = [
  body("id")
    .notEmpty()
    .withMessage("Please enter a ID.")
    .custom(async (value, { req }) => {
      return Department.findOne({
        where: { id: value, userId: req.tokenUserId },
      }).then((department) => {
        if (!department) {
          return Promise.reject(
            "A department is not exists!,or it's not for you"
          );
        }
      });
    }),
];
exports.checkCode = [
  body("code")
    .notEmpty()
    .withMessage("Please enter a code.")
    .custom(async (value, { req }) => {
      const re = new RegExp("^[A-Z0-9]+(?:List)?$");
      if (!re.test(value)) {
        const error = new Error("code must be capital letters and numbers.");
        error.statusCode = 400;
        throw error;
      }
      return true;
    })
    .custom(async (value, { req }) => {
      return Department.findOne({ where: { code: value } }).then(
        (department) => {
          if (!department) {
            return Promise.reject("A department is not exists!");
          } else {
            req.departmentId = department.id;
            req.teacherId = department.userId;
          }
        }
      );
    }),
];
exports.checkIdParam = [param("id").exists().toInt()];
exports.userMangment = [
  body("users").isArray().withMessage("users should be array"),
  body("departmentId").notEmpty().withMessage("department id should exist"),
];
