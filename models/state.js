'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class state extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      state.belongsTo(models.country, {
        as: "country",
        foreignKey: {
          name: "country_id",
        },
      });

      state.hasMany(models.city, {
        as: "state",
        foreignKey: {
          name: "state_id",
        },
      });

      state.hasMany(models.profile, {
        as: "stateProfile",
        foreignKey: {
          name: "stateId",
        },
      });
    }
  }
  state.init({
    name: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    country_code: DataTypes.STRING,
    country_name: DataTypes.STRING,
    state_code: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'state',
  });
  return state;
};