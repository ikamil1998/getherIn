"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Question, {
        foreignKey: "question",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  }
  Chat.init(
    {
      room: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
      senderName: DataTypes.STRING,
      senderImage: DataTypes.STRING,
      type: DataTypes.STRING,
      msg: DataTypes.STRING,
      img: DataTypes.STRING,
      video: DataTypes.STRING,
      record: DataTypes.STRING,
      question: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Chat;
};
