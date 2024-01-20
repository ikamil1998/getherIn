'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('AchievementDepartment', 'id',{
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: Sequelize.INTEGER,
    // },);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('AchievementDepartment', 'id');
  }
};
