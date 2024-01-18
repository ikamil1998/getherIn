const Model = require("../models");
const { handlePaginationSort } = require("../utils/pagination");
const { updateViewSetting } = require("../validations/achievments");
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
exports.updateView = async (req, res) => {
  const userId = 1;
  const { achievmentId } = req.params;
  const departments = req.body.departmentIds;
  updateViewSetting(req.body);
  const achievment = await Model.Achievments.findOne({
    where: { id: achievmentId, userId },
  });
  if (!achievment) {
    return res.status(404).json({ message: "Achievment not found" });
  }
  if (departments && departments.length) {
    const bulk = departments.map(
      ele({ departmentId: ele, achievmentId: achievment.id })
    );
    await await Model.AchievementDepartment.bulkCreate(bulk);
  }
  await Model.Achievments.update(
    { view: req.body.view },
    { where: { id: achievmentId, userId } }
  );
  return res.status(200).json({ message: "Updated successfully" });
};
exports.getAllAchievments = async (req, res) => {
  const userId = 1;
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
exports.getOneAchievement = async (req, res) => {
  const userId = 1;
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
exports.deleteAchievement = async (req, res) => {
  const userId = 1;
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
