const { user, menu_url, access_list } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../middlewares/customError");


class Auth {
  static async register(req, res, next) {
    try {
      const schema = Joi.object({
        userName: Joi.string().min(3).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
      });

      const options = {
        abortEarly: true,
        stripUnknown: true,
      };

      const { error, value } = schema.validate(req.body, options);

      if (error) throw new CustomError(error.details[0].message, 400);

      let condition = {
        where: {
          email: value.email
        }
      }

      const userData = await user.getOne(condition)

      if (userData) {
        throw { httpCode: 400, message: "Your Account Is Already Registered!" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);
      value.status = "AKTIF"
      value.roleId = 0

      await user.create({
        ...value,
        password: hashedPassword,
      });

      res.status(200).json({
        message: "User Registered Successfully",
      });
    } catch (error) {
      next(error)
    }
  };

  static async login(req, res, next) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
      });

      const options = {
        abortEarly: true,
        stripUnknown: true,
      };

      const { error, value } = schema.validate(req.body, options);

      if (error) throw new CustomError(error.details[0].message, 401);

      let condition = {
        where: {
          email: value.email,
          status: "AKTIF",
        }
      }

      const userData = await user.getOne(condition)

      if (!userData) {
        throw { httpCode: 400, message: "Password atau Email Salah" };
      }

      if (userData.roleId === 0) {
        throw { httpCode: 400, message: "User Belum Mendapat Akses, Silahkan Hubungi Admin" };
      }

      const isValid = await bcrypt.compare(value.password, userData.password);

      if (!isValid) {
        throw { httpCode: 400, message: "Password atau Email Salah" };
      }

      const dataToken = {
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        roleName: userData.roleName
      }

      const token = jwt.sign(dataToken, process.env.TOKEN_KEY, {
        expiresIn: "24h",
      });

      let permissionData = [];
      let index = 0;

      const dataMenu = await menu_url.findAll({
        raw: true,
        order: [["sort_no", "ASC"]],
      });

      if (!dataMenu.length) {
        throw new CustomError("Data not Found!", 404);
      }

      // Buat nyari Menu URL yang menjadi parent menu
      await dataMenu.forEach(async (menuData, i) => {
        if (menuData.parent === 0) {
          permissionData[index] = {
            menu_urlId: menuData.id,
            icon: menuData.icon,
            menuName: menuData.name,
            url: menuData.url,
            isParent: true,
            child: [],
          };
          index++;
        } else if (!menuData.parent) {
          permissionData[index] = {
            menu_urlId: menuData.id,
            icon: menuData.icon,
            menuName: menuData.name,
            url: menuData.url,
            isParent: false,
          };
          index++;
        }
      })

      if (permissionData.length > 0) {
        for (let i = 0; i < permissionData.length; i++) {
          for (const value of dataMenu) {
            // Nyari api yang bisa diakses oleh suatu role
            const access = await access_list.findOne({
              where: {
                roleId: userData.roleId,
                menu_urlId: value.id,
              },
              raw: true,
            });

            if (access) {
              access.action = JSON.parse(JSON.stringify(access.action));
              const action = JSON.parse(access.action);
              if (value.parent == permissionData[i].menu_urlId) {
                permissionData[i].child.push({
                  name: value.name,
                  menu_urlId: value.id,
                  url: value.url,
                  access: action,
                });
              } else if (!permissionData[i].isParent) {
                permissionData[i].access = action
              }
            }
          }
        }
      }

      permissionData = permissionData.filter((value) => {
        if (value.isParent) {
          return value.child.length > 0
        } else {
          return value.access && value.access.length > 0
        }
      })

      res.status(200).json({
        message: "Login Success",
        data: {
          token,
          ...dataToken,
          access: permissionData,
        }
      });
    } catch (error) {
      next(error)
    }
  };

  static async checkAuth(req, res, next) {
    try {
      const id = req.user.id;

      let condition = {
        where: {
          id,
        }
      }

      const userData = await user.getOne(condition)

      if (!userData) {
        throw { httpCode: 400, message: "Unauthorized!" };
      }

      const { password, ...payload } = userData

      res.status(200).json({
        message: "Authorized!",
        data: payload
      });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = Auth;