"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserReceipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserReceipt.init(
    {
      userId: DataTypes.INTEGER,
      appType: DataTypes.STRING,
	  web_order_line_item_id: DataTypes.STRING,
      receipt: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "UserReceipt",
      tableName: "user_receipt",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return UserReceipt;
};
