"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Question, {
        foreignKey: "groupId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Answer.init(
    {
      body: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
      questionId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Answer",
      tableName: "answers",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Answer;
};
