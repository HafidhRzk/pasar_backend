'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });

      profile.belongsTo(models.country, {
        as: "countryProfile",
        foreignKey: {
          name: "countryId",
        },
      });

      profile.belongsTo(models.state, {
        as: "stateProfile",
        foreignKey: {
          name: "stateId",
        },
      });

      profile.belongsTo(models.city, {
        as: "cityProfile",
        foreignKey: {
          name: "cityId",
        },
      });
    }
  }
  profile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    image: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    gender: DataTypes.ENUM('MALE', 'FEMALE'),
    countryId: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};