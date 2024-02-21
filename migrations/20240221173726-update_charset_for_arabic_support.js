'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the table's default character set and collation to support Arabic
    await queryInterface.sequelize.query(`ALTER TABLE Achievments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await queryInterface.sequelize.query(`ALTER TABLE AchievmentsCart CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);


  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table's default character set and collation back to the previous setting if needed
    await queryInterface.sequelize.query(`ALTER TABLE your_table_name CONVERT TO CHARACTER SET prev_charset COLLATE prev_collation;`);

    // Optionally, revert specific columns if necessary
    await queryInterface.sequelize.query(`ALTER TABLE your_table_name CHANGE column_name column_name VARCHAR(255) CHARACTER SET prev_charset COLLATE prev_collation;`);
  }
};
