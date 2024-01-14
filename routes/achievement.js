const express = require("express");
const isAuth = require("../middleware/is-auth");
const { uploadImages } = require("../utils/generalFunctions");


const achievmentsController = require("../controllers/achievements")
const router = express.Router();

router.post(
  "/achievments",
  isAuth,
  uploadImages.fields([
    { name: "logoImages", maxCount: 10},
    { name: "achievementsImages", maxCount: 10},
    { name: "volunteerWorkImages", maxCount: 10},
    { name: "certificatesImages", maxCount: 10},
    { name: "educationalCoursesImages", maxCount: 10},
    { name: "competitionsImages", maxCount: 10},
    { name: "activitiesImages", maxCount: 10 },
    { name: "projectsImages", maxCount: 10 },
    { name: "performingTasksImages", maxCount: 10 }
  ]),
  achievmentsController.createAchievments
);
