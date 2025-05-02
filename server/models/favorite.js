"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, { foreignKey: "UserId" });
      Favorite.belongsTo(models.Hero, { foreignKey: "HeroId" });
    }
  }
  Favorite.init(
    {
      hero_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hero name is required" },
          notEmpty: { msg: "Hero name is required" },
        },
      },
      hero_avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hero avatar is required" },
          notEmpty: { msg: "Hero avatar is required" },
        },
      },
      hero_role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hero role is required" },
          notEmpty: { msg: "Hero role is required" },
        },
      },
      hero_specially: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Hero specially is required" },
          notEmpty: { msg: "Hero specially is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required" },
          notEmpty: { msg: "User is required" },
        },
      },
      HeroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Hero is required" },
          notEmpty: { msg: "Hero is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
