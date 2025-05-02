"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const favorites = [
      {
        UserId: 1,
        HeroId: 6, // Changed from 1 to 6 (Alucard's ID from hero.json)
        hero_name: "Alucard",
        hero_avatar: "https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_2a0606e575ae278db77134b50ccef7ac.png",
        hero_role: "Fighter,Assassin",
        hero_specially: "Charge,Crowd Control",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // You can add more favorites here if needed
    ];

    await queryInterface.bulkInsert("Favorites", favorites, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Favorites", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
