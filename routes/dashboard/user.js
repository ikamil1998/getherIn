"use strict";
const express = require("express");
const dashboardController = require("../../controllers/dashboard");
const dashboardValidations = require("../../validations/dashboard");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

router.get('/info/:id', isAuth, dashboardController.getUserInfo)
router.get('/teacher/info', isAuth, dashboardController.getTeacherInfo)
router.get('/student/info', isAuth, dashboardController.getStudentsInfo)
router.get('/admin/info', isAuth, dashboardController.getAdminsInfo)
router.post('/account/create', isAuth, [...dashboardValidations.create], dashboardController.createAccount)
router.post('/account/delete', isAuth, dashboardController.deleteAccount)
module.exports = router;
