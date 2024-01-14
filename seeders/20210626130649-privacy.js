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
      "privacy",
      [
        {
          body_ar:
            "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>body { font-family: Arial, Helvetica, sans-serif;margin: 0;}html {  box-sizing: border-box;}*, *:before, *:after {  box-sizing: inherit;}.about-section {  padding: 50px;  height:100vh;  text-align: center;  background-color: #474e5d;  color: white;}</style></head><body><div class='about-section'>  <h1>السياسات و الخصوصيات</h1>  <p>بعض النصوص حول من نحن وماذا نفعل</p>  <p>قم بتغيير حجم نافذة المتصفح لترى أن هذه الصفحة تستجيب بالمناسبة</p></div></body></html>",
          body_en:
            "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1'><style>body { font-family: Arial, Helvetica, sans-serif;margin: 0;}html {  box-sizing: border-box;}*, *:before, *:after {  box-sizing: inherit;}.about-section {  padding: 50px;  height:100vh;  text-align: center;  background-color: #474e5d;  color: white;}</style></head><body><div class='about-section'>  <h1>Privacy Policy</h1>  <p>Some text about who we are and what we do.</p>  <p>Resize the browser window to see that this page is responsive by the way.</p></div></body></html>",
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
    await queryInterface.bulkDelete("privacy", null, {});
  },
};
