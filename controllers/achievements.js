const Model = require("../models");
const {
  createAchievementPage1,
  createAchievementPage2,
  createAchievementPage3,
  createAchievementPage4,
} = require("../validations/achievments");

const validateCreateAchievMent = (body) => {
  switch (body.pageNumber) {
    case 1:
      createAchievementPage1(body);
      break;
    case 2:
      createAchievementPage2(body);
      break;
    case 3:
      createAchievementPage3(body);
      break;
    case 4:
      createAchievementPage4(body);
      break;
    default:
      const error = new Error("Invalid page number");
      error.statusCode = 400;
      throw error;
  }
};
const getImagesLocation = (req) => {
  let logoImages = req.files
    .filter((ele) => ele.fieldname == "logoImages")
    .map((ele) => ele.path);
  let achievementsImages = req.files
    .filter((ele) => ele.fieldname == "achievementsImages")
    .map((ele) => ele.path);
  let volunteerWorkImages = req.files
    .filter((ele) => ele.fieldname == "volunteerWorkImages")
    .map((ele) => ele.path);
  let certificatesImages = req.files
    .filter((ele) => ele.fieldname == "certificatesImages")
    .map((ele) => ele.path);
  let educationalCoursesImages = req.files
    .filter((ele) => ele.fieldname == "educationalCoursesImages")
    .map((ele) => ele.path);
  let competitionsImages = req.files
    .filter((ele) => ele.fieldname == "competitionsImages")
    .map((ele) => ele.path);
  let activitiesImages = req.files
    .filter((ele) => ele.fieldname == "activitiesImages")
    .map((ele) => ele.path);
  let projectsImages = req.files
    .filter((ele) => ele.fieldname == "projectsImages")
    .map((ele) => ele.path);
  let performingTasksImages = req.files
    .filter((ele) => ele.fieldname == "performingTasksImages")
    .map((ele) => ele.path);
  return {
    logoImages,
    achievementsImages,
    volunteerWorkImages,
    certificatesImages,
    educationalCoursesImages,
    competitionsImages,
    activitiesImages,
    projectsImages,
    performingTasksImages,
  };
};
exports.createAchievments = async (req, res) => {
  validateCreateAchievMent(req.body);
};
