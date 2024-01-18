const express = require("express");
const isAuth = require("../middleware/is-auth");
const { uploadImages } = require("../utils/generalFunctions");

const achievmentsController = require("../controllers/achievementsCart");
const asyncWrapper = require("../utils/asyncWrapper");
const router = express.Router();

router.post(
  "/",
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
  asyncWrapper(achievmentsController.createAchievmentsCart)
);
router.get("/", isAuth,asyncWrapper(achievmentsController.getCartData));           

  router.get("/educationalStage",isAuth, asyncWrapper(achievmentsController.getEducationalStages));           
  router.get("/subjects",isAuth, asyncWrapper(achievmentsController.getSubjects));           
  router.get("/semister",isAuth, asyncWrapper(achievmentsController.getSemesters));           
  router.get("/grades",isAuth, asyncWrapper(achievmentsController.getGrades));           

module.exports = router;
