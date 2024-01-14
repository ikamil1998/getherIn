'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Chat,{
        foreignKey:'question',
        constraints: true,
        onDelete: "CASCADE",
      })
      this.hasMany(models.Option,{
        foreignKey:'questionId',
        constraints: true,
        onDelete: "CASCADE",
      })
    }
  };
  Question.init({
    type: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
    tableName:"questions",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return Question;
};