"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const heros = [
      {
        hero_name: "Alucard",
        hero_avatar:
          "https://api.dazelpro.com/mobile-legends/assets/hero/alucard.jpg",
        hero_role: "Fighter",
        hero_specially: "Reap/Charge",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hero_name: "Layla",
        hero_avatar:
          "https://api.dazelpro.com/mobile-legends/assets/hero/layla.jpg",
        hero_role: "Marksman",
        hero_specially: "Damage",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hero_name: "Gusion",
        hero_avatar:
          "https://api.dazelpro.com/mobile-legends/assets/hero/gusion.jpg",
        hero_role: "Assassin",
        hero_specially: "Burst/Reap",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hero_name: "Luo Yi",
        hero_avatar:
          "https://api.dazelpro.com/mobile-legends/assets/hero/luo-yi.jpg",
        hero_role: "Mage",
        hero_specially: "Burst/Control",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        hero_name: "Franco",
        hero_avatar:
          "https://api.dazelpro.com/mobile-legends/assets/hero/franco.jpg",
        hero_role: "Tank",
        hero_specially: "Control",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Heros", heros, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Heros", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
