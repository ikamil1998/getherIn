"use strict";
// ! don't forget validation
const express = require("express");
const answerValidation = require("../validations/answer");
const answerController = require("../controllers/answer");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/send", isAuth, [...answerValidation.send], answerController.sendAnswer);
router.get("/get/:id", isAuth, answerController.getLastAnswerByGroupId);

module.exports = router;
