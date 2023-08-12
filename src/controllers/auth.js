const { user } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../middlewares/customError");


class Auth {
  static async register(req, res, next) {
    try {
      const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
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
          email: value.email
        }
      }

      const userData = await user.getOne(condition)

      if (!userData) {
        throw { httpCode: 400, message: "Password atau Email Salah" };
      }

      const isValid = await bcrypt.compare(value.password, userData.password);

      if (!isValid) {
        throw { httpCode: 400, message: "Password atau Email Salah" };
      }

      const token = jwt.sign({ id: userData.id }, process.env.TOKEN_KEY);

      res.status(200).json({
        message: "Login Success",
        data: {
          token
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