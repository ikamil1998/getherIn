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
      // define association here
    }
  }
  Achievments.init(
    {
      body_ar: DataTypes.STRING,
      body_en: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Achievments",
      tableName: "Achievments",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Achievments;
};
