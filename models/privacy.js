'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Privacy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Privacy.init({
    body_ar: DataTypes.TEXT("long"),
    body_en: DataTypes.TEXT("long")
  }, {
    sequelize,
    modelName: 'Privacy',
    tableName:"privacy",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return Privacy;
};