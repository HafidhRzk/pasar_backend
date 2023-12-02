const Joi = require("joi");
const { access_list, menu_url, sequelize } = require("../../models");
const CustomError = require("../middlewares/customError");

class AccessList {
  static async getByRoleId(req, res, next) {
    try {
      const roleId = req.query.roleId;

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
      });

      if (permissionData.length > 0) {
        for (let i = 0; i < permissionData.length; i++) {
          for (const value of dataMenu) {
            // Nyari api yang bisa diakses oleh suatu role
            if (value.parent == permissionData[i].menu_urlId) {
              const access = await access_list.findOne({
                where: {
                  roleId: roleId,
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
              } else {
                if (permissionData[i].isParent) {
                  permissionData[i].child.push({
                    name: value.name,
                    menu_urlId: value.id,
                    url: value.url,
                    access: [],
                  });
                } else {
                  permissionData[i].access = []
                }
              }
            }
          }
        }
      }

      return res.status(200).json({ data: permissionData });
    } catch (error) {
      next(error);
    }
  }

  static async updateAccess(req, res, next) {
    try {
      const schema = Joi.object({
        roleId: Joi.number().integer().required(),
        data: Joi.array().items(
          Joi.object({
            parent: Joi.number().integer().required(),
            menu_urlId: Joi.number().integer().required(),
            action: Joi.array().items(
              Joi.string().valid("c", "r", "u", "d", "p", "a")
            ),
          })
        ),
      });
      const options = {
        abortEarly: true,
        stripUnknown: true,
      };
      const { error, value } = schema.validate(req.body, options);

      if (error) throw new CustomError(error.details[0].message, 400);

      for (const accessData of value.data) {
        if (accessData.parent === 0 && accessData.action.length > 0) {
          accessData.action = [];
        }
      }

      const result = await sequelize.transaction(async (t) => {
        for (const val of value.data) {
          const accessListString = JSON.stringify(val.action);
          const cekAccess = await access_list.findOne({
            where: {
              menu_urlId: val.menu_urlId,
              roleId: value.roleId,
            },
            transaction: t,
          });

          if (cekAccess) {
            await access_list.update(
              { action: accessListString },
              {
                where: {
                  menu_urlId: val.menu_urlId,
                  roleId: value.roleId,
                },
                transaction: t,
              }
            );
          } else {
            await access_list.create(
              {
                menu_urlId: val.menu_urlId,
                roleId: value.roleId,
                action: accessListString,
              },
              { transaction: t }
            );
          }
        }
      });

      return res.status(200).json({ message: "Access Updated!" });
    } catch (error) {
      next(error);
    }
  }
} // end class

module.exports = AccessList;
