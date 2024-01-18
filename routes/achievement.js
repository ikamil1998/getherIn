const express = require("express");
const isAuth = require("../middleware/is-auth");
const { uploadImages } = require("../utils/generalFunctions");

const achievmentsController = require("../controllers/achievements");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.get("/", isAuth, asyncWrapper(achievmentsController.getAllAchievments));
router.get("/department", isAuth, asyncWrapper(achievmentsController.getMyDepartment));
router.put("/view/:achievmentId",isAuth,  asyncWrapper(achievmentsController.updateView));
router.get("/:achievmentId", isAuth, asyncWrapper(achievmentsController.getOneAchievement));
router.delete("/:achievmentId", isAuth, asyncWrapper(achievmentsController.deleteAchievement));
module.exports = router;
