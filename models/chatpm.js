'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatPM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChatPM.init({
    room: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    senderName: DataTypes.STRING,
    senderImage: DataTypes.STRING,
    type: DataTypes.STRING,
    msg: DataTypes.STRING,
    img: DataTypes.STRING,
    video: DataTypes.STRING,
    record: DataTypes.STRING,
    isRead: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    reciverId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'ChatPM',
    tableName: 'chat_PM',
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return ChatPM;
};
