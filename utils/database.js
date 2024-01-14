const Sequelize = require("sequelize");

const sequelize = new Sequelize("learning_platform", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});
// const sequelize = new Sequelize(
//   "gathshyt_learning_platform",
//   "gathshyt_root",
//   "nU0#.c,.@W3O",
//   {
//     dialect: "mysql",
//     host: "localhost",
//     logging: false,
//   }
// );

module.exports = sequelize;
