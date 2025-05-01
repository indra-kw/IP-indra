const axios = require("axios");
const { Hero, Favorite } = require("../models");

class HeroController {
  static async getHeroes(req, res, next) {
    try {
      let hero = await Hero.findAll();
      res.status(200).json(hero);
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
      const response = await axios.get(`http://localhost:3009/hero/${id}`);
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

  static async addHero(req, res, next) {
    try {
      console.log("Request body:", JSON.stringify(req.body));
      if (!req.body || Object.keys(req.body).length === 0) {
        throw {
          statusCode: 400,
          message: "Request body is empty or invalid",
        };
      }

      const { hero_name, hero_avatar, hero_role, hero_specially } = req.body;
      const missingFields = [];
      if (!hero_name) missingFields.push("hero_name");
      if (!hero_avatar) missingFields.push("hero_avatar");
      if (!hero_role) missingFields.push("hero_role");
      if (!hero_specially) missingFields.push("hero_specially");
      if (missingFields.length > 0) {
        throw {
          statusCode: 400,
          message: `All fields (hero_name, hero_avatar, hero_role, hero_specially) are required. Missing: ${missingFields.join(
            ", "
          )}`,
        };
      }
      const UserId = req.user?.id || 1; // Default to user ID 1 if not available
      const [hero, created] = await Hero.findOrCreate({
        where: { hero_name: String(hero_name).trim() },
        defaults: {
          hero_avatar: String(hero_avatar).trim(),
          hero_role: String(hero_role).trim(),
          hero_specially: String(hero_specially).trim(),
        },
      });
      const newFavorite = await Favorite.create({
        hero_name: String(hero_name).trim(),
        hero_avatar: String(hero_avatar).trim(),
        hero_role: String(hero_role).trim(),
        hero_specially: String(hero_specially).trim(),
        UserId: UserId,
        HeroId: hero.id,
      });
      console.log("Favorite hero created successfully:", newFavorite.id);
      res.status(201).json({
        message: "Hero added to favorites successfully",
        hero: {
          id: newFavorite.id,
          hero_name: newFavorite.hero_name,
          hero_avatar: newFavorite.hero_avatar,
          hero_role: newFavorite.hero_role,
          hero_specially: newFavorite.hero_specially,
          UserId: newFavorite.UserId,
          HeroId: newFavorite.HeroId,
          createdAt: newFavorite.createdAt,
        },
      });
    } catch (error) {
      console.error("Error in addHero:", error);
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
      const hero = await Favorite.findByPk(id);
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
      await Favorite.destroy();
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
