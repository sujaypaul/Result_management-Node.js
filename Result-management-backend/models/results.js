'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Results.init({
    RollNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Name: DataTypes.STRING,
    DOB: DataTypes.STRING,
    Score: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Results',
  });
  return Results;
};