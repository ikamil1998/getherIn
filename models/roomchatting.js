"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoomChat.init(
    {
      roomId: DataTypes.INTEGER,
      chattingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RoomChat",
      modelName: "room_chat",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return RoomChat;
};
