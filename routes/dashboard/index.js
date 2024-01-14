"use strict";
const express = require("express");
const homeRouter = require('./home')
const aboutRouter = require('./about')
const privacyRouter = require('./privacy')
const adminRouter = require('./admin')
const userRouter = require('./user')
const departmentRouter = require('./department')
const router = express.Router();

router.use('/home', homeRouter)
router.use('/about',aboutRouter)
router.use('/privacy',privacyRouter)
router.use('/admin',adminRouter)
router.use('/user',userRouter)
router.use('/department',departmentRouter)

module.exports = router;

