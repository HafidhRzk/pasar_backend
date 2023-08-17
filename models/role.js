'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      role.hasMany(models.user, {
        as: "role",
        foreignKey: {
          name: "roleId",
        },
      });
    }
  }
  role.init({
    roleName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
  });

  role.getAll = async (condition) => {
    return await role.findAll({
      ...condition,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
  };

  role.getOne = async (condition) => {
    return await role.findOne({
      ...condition,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
  };

  role.countAll = async (condition) => {
    return await role.count({
      ...condition,
    });
  };

  return role;
};