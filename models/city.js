'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      city.belongsTo(models.state, {
        as: "state",
        foreignKey: {
          name: "state_id",
        },
      });

      city.belongsTo(models.country, {
        as: "country",
        foreignKey: {
          name: "country_id",
        },
      });

      city.hasMany(models.profile, {
        as: "cityProfile",
        foreignKey: {
          name: "cityId",
        },
      });
    }
  }
  city.init({
    name: DataTypes.STRING,
    state_id: DataTypes.INTEGER,
    state_code: DataTypes.STRING,
    state_name: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    country_code: DataTypes.STRING,
    country_name: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    wikiDataId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'city',
  });
  return city;
};