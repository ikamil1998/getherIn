const Model = require("../models");
const { updateViewSetting } = require("../validations/achievments");

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
