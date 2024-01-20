'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing foreign key constraint images_ibfk_1
    // await queryInterface.removeConstraint('images', 'images_ibfk_1');

    // // Add a new foreign key constraint referencing the 'Achievements' table
    // await queryInterface.addConstraint('images', {
    //   fields: ['achievementId'],
    //   type: 'foreign key',
    //   name: 'images_ibfk_2', // Choose a new name for the foreign key constraint
    //   references: {
    //     table: 'Achievements', // Change to the actual name of your Achievements table
    //     field: 'id',
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE',
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the newly added foreign key constraint
    await queryInterface.removeConstraint('images', 'images_ibfk_2');

    // Recreate the original foreign key constraint referencing the 'achievments' table
    await queryInterface.addConstraint('images', {
      fields: ['achievementId'],
      type: 'foreign key',
      name: 'images_ibfk_1',
      references: {
        table: 'achievments', // Change to the actual name of your original Achievements table
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
