const Model = require("../models");
const {
  createAchievementPage1,
  createAchievementPage2,
  createAchievementPage3,
  createAchievementPage4,
} = require("../validations/achievments");

const pageSelect = {
  1: [
    "schoolName",
    "city",
    "fullName",
    "age",
    "stage",
    "academicYear",
    "semister",
    "grade",
  ],
  2: ["hoopies", "skills", "targets"],
  3: [
    "introduction",
    "skills",
    "links",
    "externalReadings",
    "achievements",
    "volunteerWork",
    "certificates",
    "educationalCourses",
    "competitions",
  ],
  4: ["subject", "activities", "projects", "performingTasks", "comments"],
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.createAchievmentsCart = async (req, res) => {
  const id = 1;
  validateCreateAchievMent(req.body);
  const cart = await Model.AchievmentsCart.findOne({
    where: { userId: id, submited: false },
  });
  let newCart = cart
    ? await Model.AchievmentsCart.create(req.body)
    : await Model.AchievmentsCart.update(req.body, {
        where: { userId: id, submited: req.body.pageNumber == 4 ? true : false },
      });
  switch (req.body.pageNumber) {
    case 1:
      const { logoImages } = getImagesLocation(req);
      const logoBulkInsert = logoImages.map((path) => ({
        path,
        module: "logoImages",
        achievmentsCartId: newCart.id,
      }));
      await Model.Image.bulkCreate(logoBulkInsert);
      break;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case 3:
      const {
        achievementsImages,
        volunteerWorkImages,
        certificatesImages,
        educationalCoursesImages,
        competitionsImages,
      } = getImagesLocation(req);
      const achievementsImagesBulkInsert = achievementsImages.map((path) => ({
        path,
        module: "achievementsImages",
        achievmentsCartId: newCart.id,
      }));
      const volunteerWorkImagesBulkInsert = volunteerWorkImages.map((path) => ({
        path,
        module: "volunteerWorkImages",
        achievmentsCartId: newCart.id,
      }));
      const certificatesImagesBulkInsert = certificatesImages.map((path) => ({
        path,
        module: "certificatesImages",
        achievmentsCartId: newCart.id,
      }));
      const educationalCoursesImagesBulkInsert = educationalCoursesImages.map(
        (path) => ({
          path,
          module: "educationalCoursesImages",
          achievmentsCartId: newCart.id,
        })
      );
      const competitionsImagesBulkInsert = competitionsImages.map((path) => ({
        path,
        module: "competitionsImages",
        achievmentsCartId: newCart.id,
      }));
      await Model.Image.bulkCreate(
        achievementsImagesBulkInsert.concat(
          volunteerWorkImagesBulkInsert,
          certificatesImagesBulkInsert,
          educationalCoursesImagesBulkInsert,
          competitionsImagesBulkInsert
        )
      );
      break;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case 4:
      const { activitiesImages, projectsImages, performingTasksImages } =
        getImagesLocation(req);
      const activitiesImagesBulkInsert = activitiesImages.map((path) => ({
        path,
        module: "activitiesImages",
        achievmentsCartId: newCart.id,
      }));
      const projectsImagesBulkInsert = projectsImages.map((path) => ({
        path,
        module: "projectsImages",
        achievmentsCartId: newCart.id,
      }));
      const performingTasksImagesBulkInsert = performingTasksImages.map(
        (path) => ({
          path,
          module: "performingTasksImages",
          achievmentsCartId: newCart.id,
        })
      );
      await Model.Image.bulkCreate(
        activitiesImagesBulkInsert.concat(
          projectsImagesBulkInsert,
          performingTasksImagesBulkInsert
        )
      );
      const achievment = await Model.Achievments.create(newCart);
      await Model.Image.update(
        { achievmentsId: achievment.id },
        { where: { achievmentsCartId: newCart.id } }
      );
      break;
  }
};
