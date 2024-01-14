"use strict";
// ! don't forget validation
const express = require("express");
const questionValidation = require("../validations/question");
const questionController = require("../controllers/question");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/send",isAuth, [...questionValidation.send],questionController.sendQuestion);
router.get("/last/group/:id", isAuth,questionController.getLastQuestionByGroupId)
module.exports = router;
