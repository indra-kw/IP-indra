const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const axios = require("axios");

class UserController {
  static async Register(req, res, next) {
    try {
      const { email, password } = req.body;
      const newUser = await User.create({ email, password });
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { statusCode: 400, message: "Email is required" };
      }
      if (!password) {
        throw { statusCode: 400, message: "Password is required" };
      }
      const user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password)) {
        throw { statusCode: 401, message: "Invalid email or password" };
      }
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
