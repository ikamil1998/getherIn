'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Value, {
        foreignKey: "featureId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      this.belongsTo(models.Result, {
        foreignKey: "resultId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  };
  Feature.init({
    title: DataTypes.STRING,
    resultId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Feature',
    tableName: "features",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return Feature;
};