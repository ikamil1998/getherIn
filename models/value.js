'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Feature, {
        foreignKey: "featureId",
        constraints: true,
        onDelete: "CASCADE",
      })
      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        constraints: true,
        onDelete: "CASCADE",
      })
    }
  };
  Value.init({
    featureId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Value',
    tableName: "values",
    charset: "utf8",
    collate: "utf8_unicode_ci",
  });
  return Value;
};