'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  //  Remove the existing foreign key constraint images_ibfk_1
    // await queryInterface.removeConstraint('AchievementDepartment', 'AchievementDepartment_ibfk_1');

    // // Add a new foreign key constraint referencing the 'Achievements' table
    // await queryInterface.addConstraint('AchievementDepartment', {
    //   fields: ['achievmentId'],
    //   type: 'foreign key',
    //   name: 'AchievementDepartment_ibfk_9', // Choose a new name for the foreign key constraint
    //   references: {
    //     table: 'Achievements', // Change to the actual name of your Achievements table
    //     field: 'id',
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('AchievementDepartment', 'AchievementDepartment_ibfk_9');

    // Recreate the original foreign key constraint referencing the 'achievments' table
    await queryInterface.addConstraint('AchievementDepartment', {
      fields: ['achievementId'],
      type: 'foreign key',
      name: 'AchievementDepartment_ibfk_1',
      references: {
        table: 'achievments', // Change to the actual name of your original Achievements table
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
