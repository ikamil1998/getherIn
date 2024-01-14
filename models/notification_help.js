"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NotificationHelp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NotificationHelp.init(
    {
      message: DataTypes.TEXT("long"),
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NotificationHelp",
      tableName: "notification_help",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return NotificationHelp;
};
