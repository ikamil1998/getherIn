"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongs,parents
      this.belongsTo(models.User, { foreignKey: "userId" });
      // this.belongsTo(ConsumerPackage, { foreignKey: "consumerPackageId" });

      // has , child
      this.hasMany(models.Group, {
        foreignKey: "departmentId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.UserDepartment, {
        foreignKey: "departmentId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.AchievementDepartment, {
        foreignKey: "departmentId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
    // toJSON() {
    //   return {
    //     ...this.get(),
    //     createdAt: undefined,
    //     updatedAt: undefined,
    //     userId: undefined,
    //   };
    // }
  }
  Department.init(
    {
      name: { type: DataTypes.STRING },
      code: DataTypes.STRING,
      url: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      number_of_student: { type: DataTypes.INTEGER,defaultValue:0 },

      counter_groups: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "departments",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Department;
};
