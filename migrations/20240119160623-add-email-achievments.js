'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Achievments', 'email', {
      type: Sequelize.STRING, // Change the data type accordingly
      allowNull: true, // Modify as per your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Achievments', 'email');
  }
};
