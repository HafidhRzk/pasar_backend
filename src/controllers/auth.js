const { user } = require("../../models");
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

      res.status(200).json({
        message: "Login Success",
        data: {
          token,
          ...dataToken,
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