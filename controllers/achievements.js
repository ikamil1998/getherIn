const Model = require("../models");
const fs = require("fs");
const { handlePaginationSort } = require("../utils/pagination");
const {
  updateViewSetting,
  updateAchievementPage1,
  updateAchievementPage2,
  updateAchievementPage3,
  updateAchievementPage4,
} = require("../validations/achievments");
const { Op } = require("sequelize");
const { getImagesLocation } = require("./achievementsCart");
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
  4: [
    "id",
    "subject",
    "activities",
    "projects",
    "performingTasks",
    "comments",
    "pdf",
  ],
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const selectAll = [
  "view",
  ...new Set(
    pageSelect["1"].concat(pageSelect["2"], pageSelect["3"], pageSelect["4"])
  ),
];
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const validateUpdateAchievMent = (body) => {
  switch (body.pageNumber) {
    case 1:
      updateAchievementPage1(body);
      break;
    case 2:
      updateAchievementPage2(body);
      break;
    case 3:
      updateAchievementPage3(body);
      break;
    case 4:
      updateAchievementPage4(body);
      break;
    default:
      const error = new Error("Invalid page number");
      error.statusCode = 400;
      throw error;
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOneAchievmentById = async (achievmentId, pageNumber) => {
  const achievement = await Model.Achievments.findOne({
    where: { id: achievmentId },
    attributes: pageSelect[`${pageNumber}`]
      ? pageSelect[`${pageNumber}`]
      : selectAll,
  });
  const images = await Model.Image.findAll({
    where: { achievementId: achievmentId },
  });
  achievement.dataValues.logoImages = images.filter(
    (ele) => ele.module == "logoImages"
  );
  achievement.dataValues.achievementsImages = images.filter(
    (ele) => ele.module == "achievementsImages"
  );
  achievement.dataValues.volunteerWorkImages = images.filter(
    (ele) => ele.module == "volunteerWorkImages"
  );
  achievement.dataValues.certificatesImages = images.filter(
    (ele) => ele.module == "certificatesImages"
  );
  achievement.dataValues.educationalCoursesImages = images.filter(
    (ele) => ele.module == "educationalCoursesImages"
  );
  achievement.dataValues.competitionsImages = images.filter(
    (ele) => ele.module == "competitionsImages"
  );
  achievement.dataValues.activitiesImages = images.filter(
    (ele) => ele.module == "activitiesImages"
  );
  achievement.dataValues.projectsImages = images.filter(
    (ele) => ele.module == "projectsImages"
  );
  achievement.dataValues.performingTasksImages = images.filter(
    (ele) => ele.module == "performingTasksImages"
  );
  return achievement;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.updateView = async (req, res) => {
  const userId = req.tokenUserId;
  const { achievmentId } = req.params;
  const { departmentId } = req.body;
  updateViewSetting(req.body);
  const achievment = await Model.Achievments.findOne({
    where: { id: achievmentId, userId },
  });
  if (!achievment) {
    return res.status(404).json({ message: "Achievment not found" });
  }
  if (departmentId) {
    const exist = await Model.AchievementDepartment.findOne({
      where: { achievmentId },
      attributes: ["achievmentId"],
    });
    if (exist) {
      return res
        .status(400)
        .json({ message: "You already shared  this achievment" });
    }

    await Model.AchievementDepartment.create({
      departmentId,
      achievmentId: achievment.id,
    });
  }
  await Model.Achievments.update(
    { view: req.body.view },
    { where: { id: achievmentId, userId } }
  );
  return res.status(200).json({ message: "Updated successfully" });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllAchievments = async (req, res) => {
  const userId = req.tokenUserId;
  const { limit, offset } = handlePaginationSort(req.query);
  const achievments = await Model.Achievments.findAll({
    where: { userId },
    limit,
    offset,
  });
  const totalItems = await Model.Achievments.count({
    where: { userId },
  });
  return res.status(200).json({ data: achievments, count: totalItems });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getDate = async (req, res) => {
  return res.status(200).json({ data: ["1445", "1444"] });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOneAchievement = async (req, res) => {
  const userId = req.tokenUserId;
  const { achievmentId } = req.params;
  const { pageNumber } = req.query;
  const achievement = await Model.Achievments.findOne({
    where: { userId, id: achievmentId },
    attributes: pageSelect[`${pageNumber}`]
      ? pageSelect[`${pageNumber}`]
      : selectAll,
  });
  if (!achievement) {
    return res.status(404).json({ message: "Achievment not found" });
  }

  const images = await Model.Image.findAll({
    where: { achievementId: achievmentId },
  });
  achievement.dataValues.logoImages = images.filter(
    (ele) => ele.module == "logoImages"
  );
  achievement.dataValues.achievementsImages = images.filter(
    (ele) => ele.module == "achievementsImages"
  );
  achievement.dataValues.volunteerWorkImages = images.filter(
    (ele) => ele.module == "volunteerWorkImages"
  );
  achievement.dataValues.certificatesImages = images.filter(
    (ele) => ele.module == "certificatesImages"
  );
  achievement.dataValues.educationalCoursesImages = images.filter(
    (ele) => ele.module == "educationalCoursesImages"
  );
  achievement.dataValues.competitionsImages = images.filter(
    (ele) => ele.module == "competitionsImages"
  );
  achievement.dataValues.activitiesImages = images.filter(
    (ele) => ele.module == "activitiesImages"
  );
  achievement.dataValues.projectsImages = images.filter(
    (ele) => ele.module == "projectsImages"
  );
  achievement.dataValues.performingTasksImages = images.filter(
    (ele) => ele.module == "performingTasksImages"
  );
  return res.status(200).json({ data: achievement });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteAchievement = async (req, res) => {
  const userId = req.tokenUserId;
  const { achievmentId } = req.params;
  const achievement = await Model.Achievments.findOne({
    where: { userId, id: achievmentId },
  });
  if (!achievement) {
    return res.status(404).json({ message: "Achievment not found" });
  }
  await Model.Achievments.destroy({ where: { userId, id: achievmentId } });
  return res.status(203).json({ message: "Deleted Successfullt" });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getMyDepartment = async (req, res) => {
  const userId = req.tokenUserId;
  const { limit, offset } = handlePaginationSort(req.query);
  const departments = await Model.UserDepartment.findAll({
    where: { userId },
    offset,
    limit,
    include: {
      model: Model.Department,
      attributes: ["name"],
    },
  });
  const count = await Model.UserDepartment.count({
    where: { userId },
  });

  for (let dep of departments) {
    const addedValue = await Model.AchievementDepartment.findOne({
      where: { departmentId: dep.departmentId },
    });
    dep.dataValues.added = addedValue ? true : false;
  }
  return res.status(200).json({ data: departments, count });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  const image = await Model.Image.findOne({
    where: { id },
  });
  if (!image) return res.status(404).json({ message: "Image not found" });
  await Model.Image.destroy({
    where: { id },
  });
  const imagePath = `../images/${image.path}`;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return res.status(200).json({ message: "Image deleted successfully" });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getLastAchievmentMainData = async (req, res) => {
  const userId = req.tokenUserId;
  let achievement = await Model.Achievments.findOne({
    order: [["createdAt", "DESC"]],
    where: { userId },
  });
  if (!achievement)
    return res
      .status(404)
      .json({ message: "You don't have previous achievments" });
  const images = await Model.Image.findAll({
    where: { achievementId: achievement.id, module: "logoImages" },
  });
  achievement.dataValues.logoImages = images;
  return res.status(200).json({ data: achievement });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.uploadPdf = async (req, res) => {
  const userId = req.tokenUserId;

  if (!req.file) return res.status(400).json({ message: "Pdf is required" });
  const { achievmentId } = req.params;
  let achievement = await Model.Achievments.findOne({
    where: { id: achievmentId, userId },
  });
  if (!achievement)
    return res.status(404).json({ message: "Achievment not found" });
  console.log(req.file);
  await Model.Achievments.update(
    { pdf: req.file.path },
    { where: { id: achievmentId } }
  );
  return res.status(200).json({ message: "Updated successfully" });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.updateAchievment = async (req, res) => {
  req.body.pageNumber = Number(req.body.pageNumber) || 0;
  const { achievementId } = req.params;
  const userId = req.tokenUserId;
  validateUpdateAchievMent(req.body);
  let achievement = await Model.Achievments.findOne({
    where: { id: achievementId, userId },
  });
  if (!achievement) {
    return res.status(404).json({ message: "Achievment not found" });
  }
  let newAcheivment = await Model.Achievments.update(
    { ...req.body },
    {
      where: {
        userId,
        id: achievementId,
      },
      returning: true,
    }
  );
  switch (req.body.pageNumber) {
    case 1:
      const { logoImages } = getImagesLocation(req);

      const logoBulkInsert = logoImages.map((path) => ({
        path,
        module: "logoImages",
        achievementId,
      }));
      await Model.Image.bulkCreate(logoBulkInsert);
      newAcheivment = await this.getOneAchievmentById(
        achievementId,
        req.body.pageNumber
      );
      return res.status(200).json({ achievement: newAcheivment });
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
        achievementId,
      }));
      const volunteerWorkImagesBulkInsert = volunteerWorkImages.map((path) => ({
        path,
        module: "volunteerWorkImages",
        achievementId,
      }));
      const certificatesImagesBulkInsert = certificatesImages.map((path) => ({
        path,
        module: "certificatesImages",
        achievementId,
      }));
      const educationalCoursesImagesBulkInsert = educationalCoursesImages.map(
        (path) => ({
          path,
          module: "educationalCoursesImages",
          achievementId,
        })
      );
      const competitionsImagesBulkInsert = competitionsImages.map((path) => ({
        path,
        module: "competitionsImages",
        achievementId,
      }));
      await Model.Image.bulkCreate(
        achievementsImagesBulkInsert.concat(
          volunteerWorkImagesBulkInsert,
          certificatesImagesBulkInsert,
          educationalCoursesImagesBulkInsert,
          competitionsImagesBulkInsert
        )
      );
      newAcheivment = await this.getOneAchievmentById(
        achievementId,
        req.body.pageNumber
      );
      return res.status(200).json({ achievement: newAcheivment });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case 4:
      const { activitiesImages, projectsImages, performingTasksImages } =
        getImagesLocation(req);
      const activitiesImagesBulkInsert = activitiesImages.map((path) => ({
        path,
        module: "activitiesImages",
        achievementId,
      }));
      const projectsImagesBulkInsert = projectsImages.map((path) => ({
        path,
        module: "projectsImages",
        achievementId,
      }));
      const performingTasksImagesBulkInsert = performingTasksImages.map(
        (path) => ({
          path,
          module: "performingTasksImages",
          achievementId,
        })
      );
      await Model.Image.bulkCreate(
        activitiesImagesBulkInsert.concat(
          projectsImagesBulkInsert,
          performingTasksImagesBulkInsert
        )
      );

      newAcheivment = await this.getOneAchievmentById(
        achievementId,
        req.body.pageNumber
      );
      return res.status(200).json({ achievement: newAcheivment });
    default:
      newAcheivment = await this.getOneAchievmentById(
        achievementId,
        req.body.pageNumber
      );
      return res.status(200).json({ achievement: newAcheivment });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOneAchievementFromLink = async (req, res) => {
  const { achievmentId } = req.params;
  const achievement = await Model.Achievments.findOne({
    where: {
      id: achievmentId,
      view: {
        [Op.in]: [1, 3],
      },
    },
    attributes: ["id", "pdf"],
  });
  if (!achievement) {
    return res.status(404).json({ message: "Achievment not found" });
  }

  const images = await Model.Image.findAll({
    where: { achievementId: achievmentId },
  });
  achievement.dataValues.logoImages = images.filter(
    (ele) => ele.module == "logoImages"
  );
  achievement.dataValues.achievementsImages = images.filter(
    (ele) => ele.module == "achievementsImages"
  );
  achievement.dataValues.volunteerWorkImages = images.filter(
    (ele) => ele.module == "volunteerWorkImages"
  );
  achievement.dataValues.certificatesImages = images.filter(
    (ele) => ele.module == "certificatesImages"
  );
  achievement.dataValues.educationalCoursesImages = images.filter(
    (ele) => ele.module == "educationalCoursesImages"
  );
  achievement.dataValues.competitionsImages = images.filter(
    (ele) => ele.module == "competitionsImages"
  );
  achievement.dataValues.activitiesImages = images.filter(
    (ele) => ele.module == "activitiesImages"
  );
  achievement.dataValues.projectsImages = images.filter(
    (ele) => ele.module == "projectsImages"
  );
  achievement.dataValues.performingTasksImages = images.filter(
    (ele) => ele.module == "performingTasksImages"
  );
  return res.status(200).json({ data: achievement });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getOneAchievmentById = async (achievmentId, pageNumber) => {
  const achievement = await Model.Achievments.findOne({
    where: { id: achievmentId },
    attributes: pageSelect[`${pageNumber}`]
      ? pageSelect[`${pageNumber}`]
      : selectAll,
  });
  const images = await Model.Image.findAll({
    where: { achievementId: achievmentId },
  });
  achievement.dataValues.logoImages = images.filter(
    (ele) => ele.module == "logoImages"
  );
  achievement.dataValues.achievementsImages = images.filter(
    (ele) => ele.module == "achievementsImages"
  );
  achievement.dataValues.volunteerWorkImages = images.filter(
    (ele) => ele.module == "volunteerWorkImages"
  );
  achievement.dataValues.certificatesImages = images.filter(
    (ele) => ele.module == "certificatesImages"
  );
  achievement.dataValues.educationalCoursesImages = images.filter(
    (ele) => ele.module == "educationalCoursesImages"
  );
  achievement.dataValues.competitionsImages = images.filter(
    (ele) => ele.module == "competitionsImages"
  );
  achievement.dataValues.activitiesImages = images.filter(
    (ele) => ele.module == "activitiesImages"
  );
  achievement.dataValues.projectsImages = images.filter(
    (ele) => ele.module == "projectsImages"
  );
  achievement.dataValues.performingTasksImages = images.filter(
    (ele) => ele.module == "performingTasksImages"
  );
  return achievement;
};
