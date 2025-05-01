const { Favorite } = require("../models");

class FavoriteController {
  static async getFavorite(req, res, next) {
    try {
      let favorite = await Favorite.findAll();
      res.status(200).json(favorite);
    } catch (error) {
      next(error);
    }
  }

  static async editFavorite(req, res, next) {
    try {
      let id = req.params.id;
      //   console.log(id);
      let favorite = await Favorite.findByPk(id);
      //   console.log(favorite);
      let {
        hero_name,
        hero_avatar,
        hero_role,
        hero_specially,
        UserId,
        HeroId,
      } = req.body;
      await favorite.update({
        hero_name,
        hero_avatar,
        hero_role,
        hero_specially,
        UserId,
        HeroId,
      });
      res.status(200).json(favorite);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async deleteFavorite(req, res, next) {
    try {
      let favoriteId = req.params.id;
      let favorite = await Favorite.findByPk(favoriteId);
      await favorite.destroy();
      res.status(200).json({ message: `${favorite.name} success to delete` });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
}

module.exports = FavoriteController;
