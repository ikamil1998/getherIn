"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AchievmentsCart", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      schoolName: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      city: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      fullName: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      age: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      stage: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      academicYear: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      semister: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      grade: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      hoopies: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      skills: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      targets: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      introduction: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      skills: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      links: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      externalReadings: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      achievements: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      volunteerWork: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      certificates: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      educationalCourses: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      competitions: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      subject: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      activities: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      projects: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      performingTasks: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      comments: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      submited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AchievmentsCart");
  },
};
