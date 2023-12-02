'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu_url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menu_url.init({
    name: DataTypes.STRING,
    parent: DataTypes.INTEGER,
    url: DataTypes.STRING,
    sort_no: DataTypes.INTEGER,
    icon: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'menu_url',
  });
  return menu_url;
};