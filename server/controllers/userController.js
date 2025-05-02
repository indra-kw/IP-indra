const { OAuth2Client } = require("google-auth-library");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

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
  static async googleLogin(req, res, next) {
    const client = new OAuth2Client();
    const { googleToken } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          email: payload.email,
          password: Math.random().toString(36).slice(-8),
        },
        hooks: false,
      });
      const token = signToken({ id: user.id });
      res.status(created ? 201 : 200).json({ access_token: token });
    } catch (error) {
      console.log(error);

      console.log(error);

      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async profile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      console.log(user);

      if (!user) {
        throw { statusCode: 404, message: "User not found" };
      }
      res.status(200).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }
  static async updateProfile(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw { statusCode: 404, message: "User not found" };
      }
      await user.update({ email });
      res.status(200).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
