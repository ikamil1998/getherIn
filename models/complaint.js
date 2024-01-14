'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
this.belongsTo(models.User, {
        foreignKey: "userId",
        constraints: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    }
  };
  Complaint.init({
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Complaint',
  });
  return Complaint;
};
