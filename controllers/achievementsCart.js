const Model = require("../models");
const { AchievmentsCart } = require("../models/achievmentsCart");
const { educationalStages, semesters } = require("../utils/constant");
const {
  createAchievementPage1,
  createAchievementPage2,
  createAchievementPage3,
  createAchievementPage4,
} = require("../validations/achievments");

const pageSelect = {
  1: [
    "id",
    "schoolName",
    "city",
    "fullName",
    "age",
    "stage",
    "academicYear",
    "semister",
    "grade",
  ],
  2: ["hoopies", "skills", "targets", "id"],
  3: [
    "id",
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
  4: ["id", "subject", "activities", "projects", "performingTasks", "comments"],
};
const selectAll = [
  ...new Set(
    pageSelect["1"].concat(pageSelect["2"], pageSelect["3"], pageSelect["4"])
  ),
];
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
  let logoImages = req.files?.logoImages?.map((ele) => ele.path) || [];
  let achievementsImages =
    req.files?.achievementsImages?.map((ele) => ele.path) || [];
  let volunteerWorkImages =
    req.files?.volunteerWorkImages?.map((ele) => ele.path) || [];
  let certificatesImages =
    req.files?.certificatesImages?.map((ele) => ele.path) || [];
  let educationalCoursesImages =
    req.files?.educationalCoursesImages?.map((ele) => ele.path) || [];
  let competitionsImages =
    req.files?.competitionsImages?.map((ele) => ele.path) || [];
  let activitiesImages =
    req.files?.activitiesImages?.map((ele) => ele.path) || [];
  let projectsImages = req.files?.projectsImages?.map((ele) => ele.path) || [];
  let performingTasksImages =
    req.files?.performingTasksImages?.map((ele) => ele.path) || [];

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
  req.body.pageNumber = Number(req.body.pageNumber) || 0;
  const id = req.tokenUserId
  validateCreateAchievMent(req.body);
  const cart = await Model.AchievmentsCart.findOne({
    where: { userId: id, submited: false },
  });
  let newCart = cart
    ? await Model.AchievmentsCart.update(
        { ...req.body, submited: req.body.pageNumber == 4 ? true : false },
        {
          where: {
            userId: id,
          },
          returning: true,
        }
      )
    : await Model.AchievmentsCart.create({ ...req.body, userId: id });
  switch (req.body.pageNumber) {
    case 1:
      const { logoImages } = getImagesLocation(req);

      const logoBulkInsert = logoImages.map((path) => ({
        path,
        module: "logoImages",
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      await Model.Image.bulkCreate(logoBulkInsert);
      return res.status(200).json({ achievment: newCart });
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
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      const volunteerWorkImagesBulkInsert = volunteerWorkImages.map((path) => ({
        path,
        module: "volunteerWorkImages",
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      const certificatesImagesBulkInsert = certificatesImages.map((path) => ({
        path,
        module: "certificatesImages",
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      const educationalCoursesImagesBulkInsert = educationalCoursesImages.map(
        (path) => ({
          path,
          module: "educationalCoursesImages",
          achievementCartId: cart ? cart.id : newCart.id,
        })
      );
      const competitionsImagesBulkInsert = competitionsImages.map((path) => ({
        path,
        module: "competitionsImages",
        achievementCartId: cart ? cart.id : newCart.id,
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
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      const projectsImagesBulkInsert = projectsImages.map((path) => ({
        path,
        module: "projectsImages",
        achievementCartId: cart ? cart.id : newCart.id,
      }));
      const performingTasksImagesBulkInsert = performingTasksImages.map(
        (path) => ({
          path,
          module: "performingTasksImages",
          achievementCartId: cart ? cart.id : newCart.id,
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
        { achievementId: achievment.id },
        { where: { achievementCartId: cart ? cart.id : newCart.id } }
      );
      break;
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getCartData = async (req, res) => {
  const id = req.tokenUserId
  const { pageNumber } = req.query;
  let mainCart = await Model.AchievmentsCart.findOne({
    where: { userId: id, submited: false },
    attributes: pageSelect[`${pageNumber}`]
      ? pageSelect[`${pageNumber}`]
      : selectAll,
  });
  if (!mainCart) {
    return res
      .status(404)
      .json({ message: "You don't have any existing data" });
  }
  const images = await Model.Image.findAll({
    where: { achievementCartId: mainCart.id },
  });
  mainCart.dataValues.logoImages = images.filter((ele)=> ele.module == "logoImages")
  mainCart.dataValues.achievementsImages = images.filter((ele)=> ele.module == "achievementsImages")
  mainCart.dataValues.volunteerWorkImages = images.filter((ele)=> ele.module == "volunteerWorkImages")
  mainCart.dataValues.certificatesImages = images.filter((ele)=> ele.module == "certificatesImages")
  mainCart.dataValues.educationalCoursesImages = images.filter((ele)=> ele.module == "educationalCoursesImages")
  mainCart.dataValues.competitionsImages = images.filter((ele)=> ele.module == "competitionsImages")
  mainCart.dataValues.activitiesImages = images.filter((ele)=> ele.module == "activitiesImages")
  mainCart.dataValues.projectsImages = images.filter((ele)=> ele.module == "projectsImages")
  mainCart.dataValues.performingTasksImages = images.filter((ele)=> ele.module == "performingTasksImages")
  return res.status(200).json({ data: mainCart });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getEducationalStages = async (req, res)=>{
  return res.status(200).json({data : educationalStages})
}
exports.getSemesters = async (req, res)=>{
  return res.status(200).json({data : semesters})
}
exports.getGrades = async (req, res)=>{
  const stage = req.query.stage || "none"
  const existingStage = educationalStages[`${stage}`]
  if(!existingStage)return res.status(400).json({message :  "Stage not found"})
  return res.status(200).json({data : existingStage})
}

