"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Department, { foreignKey: "departmentId" });
    }
  }
  UserDepartment.init(
    {
      userId: DataTypes.INTEGER,
      departmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserDepartment",
      tableName: "user_department",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return UserDepartment;
};
