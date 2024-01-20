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
      this.belongsTo(models.Achievments, {
        foreignKey: "achievmentId",
        constraints: true,
        onDelete: "CASCADE",
      })
      this.belongsTo(models.Department, {
        foreignKey: "departmentId",
        constraints: true,
        onDelete: "CASCADE",
      })
      this.belongsTo(models.User, {
        foreignKey: "userId",
        constraints: true,
        onDelete: "CASCADE",
      })
      // define association here
    
    }
  }
  AchievementDepartment.init(
    {
        achievmentId: DataTypes.INTEGER,
        departmentId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
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
