"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      path: { type: Sequelize.STRING },
      module: { type: Sequelize.STRING },
      userId: {
        type: Sequelize.INTEGER,
      },
      achievmentsCartId: {
        type: Sequelize.INTEGER,
      },
      achievmentsId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("images");
  },
};
