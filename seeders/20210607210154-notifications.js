"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "notifications",
      [
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الأول",
          title_en: "first",
          userId: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الثاني",
          title_en: "second",
          userId: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الثالث",
          title_en: "3",
          userId: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الرابع",
          title_en: "4",
          userId: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الخامس",
          title_en: "5",
          userId: 1,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "السادس",
          title_en: "6",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "السابع",
          title_en: "7",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الثامن",
          title_en: "8",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "التاسع",
          title_en: "9",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "العاشر",
          title_en: "10",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body_ar: "John Doe",
          body_en: "John Doe",
          title_ar: "الحادي عشر",
          title_en: "11",
          userId: 1,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("notifications", null, {});
  },
};
