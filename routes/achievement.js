const express = require("express");
const isAuth = require("../middleware/is-auth");
const { uploadImages } = require("../utils/generalFunctions");

const achievmentsController = require("../controllers/achievements");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.get("/", asyncWrapper(achievmentsController.getAllAchievments));
router.get("/department", asyncWrapper(achievmentsController.getMyDepartment));
router.put("/view/:achievmentId", asyncWrapper(achievmentsController.updateView));
router.get("/:achievmentId", asyncWrapper(achievmentsController.getOneAchievement));
router.delete("/:achievmentId", asyncWrapper(achievmentsController.deleteAchievement));
module.exports = router;
