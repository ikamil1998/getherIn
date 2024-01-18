"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AchievementDepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Achievments, { foreignKey: "achievmentId" });
      this.belongsTo(models.Department, { foreignKey: "departmentId" });
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  AchievementDepartment.init(
    {
        achievmentId: DataTypes.INTEGER,
        departmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AchievementDepartment",
      tableName: "AchievementDepartment",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return AchievementDepartment;
};
