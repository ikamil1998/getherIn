const { body } = require("express-validator");
const { User } = require("../models");

exports.sendEmail = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject("E-Mail address already exists!");
        }
      });
    }),
];
exports.signUp = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then((user) => {
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
  // body("code")
  //   .trim()
  //   .isLength({ min: 6, max: 6 })
  //   .withMessage("code must be 6 letters and numbers "),
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
  // body("token_expires")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .custom((value, { req }) => {
  //     re = new RegExp("[1-9]+h|[1-9]+d|[1-9]+h");
  //     if (!re.test(value)) {
  //       const error = new Error("token_expires is not valid.");
  //       error.statusCode = 500;
  //       throw error;
  //     }
  //     return true;
  //   }),
];

exports.updatePassword1 = [
  body(
    "passwordConfirmation",
    "passwordConfirmation field must have the same value as the password field"
  )
    .exists()
    .custom((value, { req }) => value === req.body.new_password),
];
exports.signIn = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().isLength({ min: 5 }),
  // body("token_expires")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .custom((value, { req }) => {
  //     re = new RegExp("[1-9]+h|[1-9]+d|[1-9]+h");
  //     if (!re.test(value)) {
  //       const error = new Error("token_expires is not valid.");
  //       error.statusCode = 500;
  //       throw error;
  //     }
  //     return true;
  //   }),
  // body("kind")
  //   .trim()
  //   .not()
  //   .isEmpty()
  //   .withMessage("Please enter a kind.")
  //   .custom((value, { req }) => {
  //     if (value !== "admin" && value !== "teacher" && value !== "student") {
  //       const error = new Error("kind is not valid.");
  //       error.statusCode = 500;
  //       throw error;
  //     }
  //     return true;
  //   }),
];
// exports.getUser = [
//   body("id").isNumeric().withMessage("Please enter a valid id."),
// ];
exports.checkCode = [
  body("code")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("code must be 6 letters and numbers "),
  body("email").isEmail().withMessage("Please enter a valid email."),
];
exports.updateInfo = [
  body("new_password", "should exist")
    .if(body("old_password").exists())
    // ...then the old password must be too...
    .notEmpty(),
  body("old_password")
    .if(body("new_password").exists())
    // ...then the old password must be too...
    .notEmpty()
    .withMessage("old passwrod should exist")
    // ...and they must not be equal.
    .custom((value, { req }) => {
      console.log(value);
      return value !== req.body.new_password;
    })
    .withMessage("new password is as same as old password"),
  //   .if(body("old_password").exists())
  //   // ...then the old password must be too...
  //   .notEmpty(),
];

exports.checkEmail = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (!user) {
          return Promise.reject("E-Mail address is not exists yet");
        }
      });
    }),
];
exports.updatePassword = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (!user) {
          return Promise.reject("E-Mail address is not exists yet");
        }
      });
    }),
  body("newPassword").exists().trim().isLength({ min: 5 }),
  body(
    "passwordConfirmation",
    "passwordConfirmation field must have the same value as the newPassword field"
  )
    .exists()
    .custom((value, { req }) => value === req.body.newPassword),
];

exports.checkToken = [
  body("token").notEmpty().withMessage("token should exist"),
];
