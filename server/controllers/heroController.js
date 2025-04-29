const axios = require("axios");
const { Hero } = require("../models");

class HeroController {
  static async getHeroes(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/hero"
      );
      const formattedHeroes = response.data.hero.map((hero) => ({
        id: hero.hero_id,
        hero_name: hero.hero_name,
        hero_avatar: hero.hero_avatar,
        hero_role: hero.hero_role,
        hero_specially: hero.hero_specially,
      }));
      res.status(200).json(formattedHeroes);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroesByRole(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/role"
      );
      const formattedRoles = response.data.role.map((role, index) => ({
        role_id: index + 1,
        role_name: role.role_name,
      }));
      res.status(200).json(formattedRoles);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroesBySpecially(req, res, next) {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/specially"
      );
      const formattedSpecialties = response.data.specially.map(
        (specially, index) => ({
          specially_id: index + 1,
          specially_name: specially.specially_name,
        })
      );
      res.status(200).json(formattedSpecialties);
    } catch (error) {
      next(error);
    }
  }

  static async getHeroById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw { statusCode: 400, message: "Hero ID is required" };
      }
      const response = await axios.get(
        `https://api.dazelpro.com/mobile-legends/hero/${id}`
      );
      if (!response.data.hero || response.data.hero.length === 0) {
        throw { statusCode: 404, message: "Hero not found" };
      }
      const formattedHero = response.data.hero.map((hero) => ({
        id: hero.hero_id,
        hero_name: hero.hero_name,
        hero_avatar: hero.hero_avatar,
        hero_role: hero.hero_role,
        hero_specially: hero.hero_specially,
      }));
      res.status(200).json(formattedHero[0]);
    } catch (error) {
      if (error.response) {
        return next({
          statusCode: error.response.status,
          message: error.response.data.message || "API error",
        });
      } else if (error.request) {
        return next({
          statusCode: 503,
          message: "Service unavailable",
        });
      }
      next(error);
    }
  }

  static async updateHero(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw { statusCode: 400, message: "Hero ID is required" };
      }
      const { hero_name, hero_avatar, hero_role, hero_specially } = req.body;
      const hero = await Hero.findByPk(id);
      if (!hero) {
        throw { statusCode: 404, message: "Hero not found" };
      }
      await hero.update({
        hero_name: hero_name || hero.hero_name,
        hero_avatar: hero_avatar || hero.hero_avatar,
        hero_role: hero_role || hero.hero_role,
        hero_specially: hero_specially || hero.hero_specially,
      });
      res.status(200).json({
        message: "Hero updated successfully",
        hero: {
          id: hero.id,
          hero_name: hero.hero_name,
          hero_avatar: hero.hero_avatar,
          hero_role: hero.hero_role,
          hero_specially: hero.hero_specially,
          updatedAt: hero.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteHero(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw { statusCode: 400, message: "Hero ID is required" };
      }
      const hero = await Hero.findByPk(id);
      if (!hero) {
        throw { statusCode: 404, message: "Hero not found" };
      }
      await hero.destroy();
      res.status(200).json({
        message: "Hero deleted successfully",
        deletedHero: {
          id: hero.id,
          hero_name: hero.hero_name,
          hero_role: hero.hero_role,
          hero_specially: hero.hero_specially,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HeroController;
