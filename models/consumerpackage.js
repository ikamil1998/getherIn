"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ConsumerPackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Package, Department, Group }) {
      // define association here
      // parents
      this.belongsTo(User, {
        foreignKey: "userId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.belongsTo(Package, {
        foreignKey: "packageId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ConsumerPackage.init(
    {
      userId: DataTypes.INTEGER,
      packageId: DataTypes.INTEGER,
      current_number_of_department: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      current_number_of_group: { type: DataTypes.INTEGER, defaultValue: 0 },
      current_number_of_students: { type: DataTypes.INTEGER, defaultValue: 0 },
      isValid: { type: DataTypes.BOOLEAN, defaultValue: true },
      date: { type: DataTypes.DATE() },
      end_date: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "ConsumerPackage",
      tableName: "consumer_packages",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return ConsumerPackage;
};
