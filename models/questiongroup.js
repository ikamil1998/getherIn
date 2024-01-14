'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionGroup extends Model {
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
      })
      this.belongsTo(models.Question, {
        foreignKey: "questionId",
        constraints: true,
        onDelete: "CASCADE",
      })
    }
  };
  QuestionGroup.init({
    groupId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionGroup',
    tableName: "question_group",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return QuestionGroup;
};