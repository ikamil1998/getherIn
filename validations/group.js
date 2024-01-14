"use strict";

const { body, param } = require("express-validator");
const { Group } = require("../models");
const Model = require("../models");

exports.create = [
  body("departmentId")
    .notEmpty()
    .withMessage("Please enter a department ID.")
    .isInt()
    .withMessage("department ID must be integer")
    .custom(async (value, { req }) => {
      return Model.Department.findOne({ raw: true, where: { id: value } }).then(
        (department) => {
          if (!department) {
            return Promise.reject("Department is not exists");
          }
        }
      );
    }),
  body("name")
    .notEmpty()
    .withMessage("Please enter a name.")
    .custom(async (value, { req }) => {
      return Group.findOne({
        where: { name: value, departmentId: req.body.departmentId },
      }).then((group) => {
        if (group) {
          return Promise.reject("A group already exists in department!");
        }
      });
    }),
];
exports.checkName = [
  body("id")
    .notEmpty()
    .withMessage("Please enter a ID.")
    .custom(async (value, { req }) => {
      return Group.findOne({ where: { id: value } }).then((group) => {
        if (!group) {
          return Promise.reject("A group is not exists!");
        }
      });
    }),
];
exports.checkId = [param("id").exists().toInt()];

exports.userMangment = [
  body("users").isArray().withMessage("users should be array"),
  body("groupId").notEmpty().withMessage("group id should exist"),
];
exports.leader = [
  body("id")
    .notEmpty()
    .withMessage("Please enter a ID.")
    .custom(async (value, { req }) => {
      return Group.findOne({ where: { id: value } }).then((group) => {
        if (!group) {
          return Promise.reject("A group is not exists!");
        } else req.group = group;
      });
    }),
  body("leader_id")
    .notEmpty()
    .withMessage("Please enter a leader ID.")
    .custom(async (value, { req }) => {
      return Model.User.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
          return Promise.reject("A user is not exists!");
        }
      });
    }),
];
