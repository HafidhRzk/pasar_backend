const { role } = require("../../models");
const Joi = require("joi");
const CustomError = require("../middlewares/customError");
const { totalPage } = require('../utils/helper');

class Role {
  static async getForSelectOpt(req, res, next) {
    try {
      const data = await role.getAll()

      return res.status(200).json({
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const {
        query: { search, currentPage, pageSize, sort, sortType },
      } = req;

      const arrSort = {
        roleName: "roleName",
        createdAt: "createdAt"
      };
      const arrSortType = { asc: "ASC", desc: "DESC" };

      const querySort = arrSort[sort] || arrSort.createdAt;
      const querySortType = arrSortType[sortType] || arrSortType.desc;
      const limit = Number(pageSize) || 10;
      const current_Page = currentPage || 1;
      const offset = (current_Page - 1) * limit;

      let condition = {};
      if (search) {
        condition = {
          roleName: { [Op.substring]: search }
        };
      }

      const data = await role.getAll({
        where: condition,
        order: [[querySort, querySortType]],
        offset: offset,
        limit: limit
      });

      const totalData = await role.countAll({
        where: condition,
        col: "id",
      });

      const meta = {
        currentPage: Number(current_Page),
        pageCount: totalPage(totalData, limit),
        pageSize: limit,
        totalData: totalData,
      };

      return res.status(200).json({
        data,
        meta
      });
    } catch (error) {
      next(error);
    }
  }

  static async createRole(req, res, next) {
    try {
      const schema = Joi.object({
        roleName: Joi.string().max(50).required(),
      });
      const options = {
        abortEarly: true,
        stripUnknown: true,
      };
      const { error, value } = schema.validate(req.body, options);

      if (error) throw new CustomError(error.details[0].message, 400);

      const data = await role.getOne({
        where: {
          roleName: value.roleName
        }
      })

      if (data) throw new CustomError('Role Sudah Ada', 404);

      await role.create(value);

      return res.status(200).json({ message: 'New Role Created!' });
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req, res, next) {
    try {
      const roleId = req.params.id;

      const schema = Joi.object({
        roleName: Joi.string().max(50),
      });
      const options = {
        abortEarly: true,
        stripUnknown: true,
      };
      const { error, value } = schema.validate(req.body, options);

      if (error) throw new CustomError(error.details[0].message, 400);

      const roleData = await role.getOne({
        where: { id: roleId }
      });

      if (!roleData) throw new CustomError('Role not Found', 404);

      const data = await role.getOne({
        where: {
          roleName: value.roleName
        }
      })

      if (data) throw new CustomError('Role Sudah Ada', 404);

      roleData.set(value);
      await roleData.save();

      return res.status(200).json({ message: 'Role Data Updated!' });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const roleId = req.params.id;

      const roleData = await role.getOne({
        where: { id: roleId }
      });
      if (!roleData) throw new CustomError('Role not Found', 404);

      return res.status(200).json({ data: roleData });
    } catch (error) {
      next(error);
    }
  }

  static async deleteById(req, res, next) {
    try {
      const roleId = req.params.id;

      const roleData = await role.getOne({
        where: { id: roleId }
      });
      if (!roleData) throw new CustomError('Role not Found', 404);

      await roleData.destroy();

      return res.status(200).json({ message: 'Delete Success' });
    } catch (error) {
      next(error);
    }
  }

} // end class

module.exports = Role;
