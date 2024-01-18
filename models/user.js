"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Department, { foreignKey: "userId" });
      this.hasMany(models.UserDepartment, { foreignKey: "userId" });
      this.hasMany(models.AchievementDepartment, { foreignKey: "userId" });
      this.hasMany(models.Group, {
        as: "master",
        foreignKey: "master",
        constraints: true,
        onDelete: "SET NULL",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      fullName: DataTypes.STRING,
      kind: DataTypes.STRING,
      password: DataTypes.STRING,
      picture: {
        type: DataTypes.STRING,
        defaultValue: "images/defalut_icon.jpg",
      },
      phone: DataTypes.STRING,
      firebaseToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return User;
};
