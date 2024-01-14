'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatPMs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room: {
        type: Sequelize.STRING
      },
      senderId: {
        type: Sequelize.INTEGER
      },
      senderName: {
        type: Sequelize.STRING
      },
      senderImage: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      msg: {
        type: Sequelize.STRING
      },
      img: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      record: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatPMs');
  }
};