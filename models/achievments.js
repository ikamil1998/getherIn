"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Achievments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Image, {
        foreignKey: "achievementId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.Image, {
        foreignKey: "AchievementDepartment",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Achievments.init(
    {
      schoolName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      fullName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      age: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      stage: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      academicYear: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      semister: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      grade: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      hoopies: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      skills: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      targets: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      introduction: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      skills: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      links: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      externalReadings: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      achievements: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      volunteerWork: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      certificates: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      educationalCourses: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      competitions: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      subject: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      activities: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      projects: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      performingTasks: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      comments: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      view: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      pdf : {
        type: DataTypes.STRING,
        defaultValue: null,
      }
    },
    {
      sequelize,
      modelName: "Achievments",
      tableName: "achievments",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Achievments;
};
