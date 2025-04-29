"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hero.hasMany(models.Favorite, { foreignKey: "HeroId" });
    }
  }
  Hero.init(
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
    },
    {
      sequelize,
      modelName: "Hero",
    }
  );
  return Hero;
};
