"use strict";
const express = require("express");
// data

const authController = require("../controllers/auth");
//
const isAuth = require("../middleware/is-auth");
//
const ValidationUser = require("../validations/user");
const router = express.Router();

router.post(
  "/send/email",
  [...ValidationUser.sendEmail],
  authController.sendCodeToEmail
);

router.post("/signup", [...ValidationUser.signUp], authController.signup);

// router.post("/checkcode", [...ValidationUser.checkCode], authController.checkCode);

router.post("/signin", [...ValidationUser.signIn], authController.signin);

router.post(
  "/update",
  isAuth,
  [...ValidationUser.updateInfo],
  authController.updateInfo
);
router.post(
  "/update/info/password",
  isAuth,
  [...ValidationUser.updatePassword1],
  authController.updatePassword1
);

router.get("/user", isAuth, authController.getUserInfoById);

router.post(
  "/forget/password",
  [...ValidationUser.checkEmail],
  authController.sendCodeToEmailToPassword
);
router.post(
  "/update/password",
  [...ValidationUser.updatePassword],
  authController.updatePassword
);
router.post(
  "/firebase/set/token",
  isAuth,
  [...ValidationUser.checkToken],
  authController.setFirebaseToken
);
router.post("/signout",isAuth,authController.signOut)
module.exports = router;
