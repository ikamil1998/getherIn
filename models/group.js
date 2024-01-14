"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Department, { foreignKey: "departmentId" });
      // this.belongsTo(ConsumerPackage, { foreignKey: "consumerPackageId" });
      this.hasMany(models.UserGroup, {
        foreignKey: "groupId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.User, {
        foreignKey: "leader",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Group.init(
    {
      name: { type: DataTypes.STRING },
      departmentId: DataTypes.INTEGER,
      leader: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Group",
      tableName: "groups",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Group;
};
