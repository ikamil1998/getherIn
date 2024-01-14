"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Package.init(
    {
      name: DataTypes.STRING,
      name_ar: DataTypes.STRING,
      pack_android_ID: DataTypes.STRING,
      pack_ios_ID: DataTypes.STRING,
      number_of_department: DataTypes.INTEGER,
      number_of_group: {
        type: DataTypes.INTEGER,
        defaultValue: 4

      },
      number_of_students: {
        type: DataTypes.INTEGER,
        defaultValue: 32

      },
      expiry: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      image: DataTypes.STRING,
      type: DataTypes.STRING,
      type_ar: DataTypes.STRING,
      private: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "Package",
      tableName: "packages",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Package;
};
 
