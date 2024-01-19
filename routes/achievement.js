const express = require("express");
const isAuth = require("../middleware/is-auth");
const { uploadImages, uploadPdf } = require("../utils/generalFunctions");

const achievmentsController = require("../controllers/achievements");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.get("/", isAuth, asyncWrapper(achievmentsController.getAllAchievments));
router.get(
  "/pdf/:achievmentId",
  isAuth,
  asyncWrapper(uploadPdf.single("pdf")),
  asyncWrapper(achievmentsController.uploadPdf)
);
router.get(
  "/last",
  isAuth,
  asyncWrapper(achievmentsController.getLastAchievmentMainData)
);
router.get(
  "/department",
  isAuth,
  asyncWrapper(achievmentsController.getMyDepartment)
);
router.put(
  "/view/:achievmentId",
  isAuth,
  asyncWrapper(achievmentsController.updateView)
);
router.get(
  "/:achievmentId",
  isAuth,
  asyncWrapper(achievmentsController.getOneAchievement)
);
router.delete(
  "/:achievmentId",
  isAuth,
  asyncWrapper(achievmentsController.deleteAchievement)
);
router.put(
  "/:achievementId",
  isAuth,
  asyncWrapper(
    uploadImages.fields([
      { name: "logoImages", maxCount: 5 },
      { name: "achievementsImages", maxCount: 5 },
      { name: "volunteerWorkImages", maxCount: 5 },
      { name: "certificatesImages", maxCount: 5 },
      { name: "educationalCoursesImages", maxCount: 5 },
      { name: "competitionsImages", maxCount: 5 },
      { name: "activitiesImages", maxCount: 5 },
      { name: "projectsImages", maxCount: 5 },
      { name: "performingTasksImages", maxCount: 5 },
    ])
  ),
  asyncWrapper(achievmentsController.updateAchievment)
);
module.exports = router;
