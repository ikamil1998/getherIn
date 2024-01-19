const express = require("express");
const isAuth = require("../middleware/is-auth");

const achievmentsController = require("../controllers/achievements");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.delete("/:id", isAuth, asyncWrapper(achievmentsController.deleteImage));


module.exports = router;
