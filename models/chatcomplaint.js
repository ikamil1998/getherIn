'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatComplaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ChatComplaint.init({
    createUserId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatComplaint',
    tableName: 'chatComplaint',
  });
  return ChatComplaint;
};
