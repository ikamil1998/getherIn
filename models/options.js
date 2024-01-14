'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Question, {
      //   foreignKey: 'questionId',
      //   constraints: true,
      //   onDelete: "CASCADE",
      // })
      this.hasMany(models.OptionGroup, {
        foreignKey: 'optionId',
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  };
  Option.init({
    body: DataTypes.STRING,
    questionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Option',
    tableName:"options",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return Option;
};