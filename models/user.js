'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "userId",
        },
      });

      user.belongsTo(models.role, {
        as: "role",
        foreignKey: {
          name: "roleId",
        },
      });
    }
  }
  user.init({
    email: DataTypes.STRING,
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.ENUM('AKTIF', 'TIDAK AKTIF'),
    roleId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'user',
  });

  user.getOne = async (condition) => {
    return await user.findOne({
      ...condition,
      include: [
        {
          model: sequelize.models.role,
          as: "role",
          attributes: []
        }
      ],
      attributes: {
        include: [
          [sequelize.col("role.roleName"), "roleName"]
        ],
        exclude: [
          'createdAt', 'updatedAt'
        ]
      },
      raw: true
    })
  }

  return user;
};