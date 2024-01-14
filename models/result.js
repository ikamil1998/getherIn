"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Department, {
        foreignKey: "departmentId",
        constraints: true,
        onDelete: "CASCADE",
      });
      this.hasMany(models.Feature, {
        foreignKey: "resultId",
        constraints: true,
        onDelete: "CASCADE",
      })
    }
  }
  Result.init(
    {
      departmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Result",
      tableName: "results",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Result;
};
