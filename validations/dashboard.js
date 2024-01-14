const { body } = require("express-validator");
const Model = require("../models");
exports.create =
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return Model.User.findOne({ where: { email: value } }).then((user) => {
                    if (user) {
                        return Promise.reject("E-Mail address already exists!");
                    }
                });
            }),
        body("password").exists().trim().isLength({ min: 5 }),
        body(
            "passwordConfirmation",
            "passwordConfirmation field must have the same value as the password field"
        )
            .exists()
            .custom((value, { req }) => value === req.body.password),
        body("fullName").trim().not().isEmpty(),
        body("kind")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please enter a kind.")
            .custom((value, { req }) => {
                if (value !== "teacher" && value !== "student" && value !== "admin") {
                    const error = new Error("kind is not valid.");
                    error.statusCode = 500;
                    throw error;
                }
                return true;
            }),

    ]
exports.set = [
    body("body_ar").trim().not().isEmpty(),
    body("body_en").trim().not().isEmpty(),
]