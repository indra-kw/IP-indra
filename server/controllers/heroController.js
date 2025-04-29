const axios = require("axios");

class HeroController {
  static async getHeroById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await axios.get(
        `https://api.dazelpro.com/mobile-legends/hero/${id}`
      );
      console.log(id);

      if (!response.data.hero.length) {
        throw { statusCode: 404, message: "Hero not found" };
      }
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroes(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/hero"
      );
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroesByRole(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/role"
      );
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroesBySpecially(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/specially"
      );
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HeroController;
