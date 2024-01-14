const { body } = require("express-validator");
const { User } = require("../models");

exports.send=[
    body("groups").isArray().withMessage("groups should be array"),
    body("type").not().isEmpty().withMessage("type must not empty"),
    body("body").not().isEmpty().withMessage("type must not empty")
]