const { body } = require("express-validator");
const Model = require("../models");
exports.create =
    [
        body("message").isString().not().isEmpty(),
    ]
