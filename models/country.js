'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      country.hasMany(models.state, {
        as: "country",
        foreignKey: {
          name: "country_id",
        },
      });

      country.hasMany(models.profile, {
        as: "countryProfile",
        foreignKey: {
          name: "countryId",
        },
      });
    }
  }
  country.init({
    name: DataTypes.STRING,
    numeric_code: DataTypes.STRING,
    phone_code: DataTypes.STRING,
    capital: DataTypes.STRING,
    currency: DataTypes.STRING,
    currency_name: DataTypes.STRING,
    native: DataTypes.STRING,
    region: DataTypes.STRING,
    subregion: DataTypes.STRING,
    nationality: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'country',
  });
  return country;
};