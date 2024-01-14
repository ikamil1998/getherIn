'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OptionGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Option, {
        foreignKey: "optionId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      this.belongsTo(models.User, {
        foreignKey: "userId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  };
  OptionGroup.init({
    optionId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    selected: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'OptionGroup',
    tableName: "option_group",
    charset: "utf8",
    collate: "utf8_unicode_ci",

  });
  return OptionGroup;
};