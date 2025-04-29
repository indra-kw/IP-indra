"use strict";
const axios = require("axios");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Fetch heroes from the API
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/hero"
      );

      // Format the heroes for database insertion
      const heroes = response.data.hero.map((hero) => ({
        hero_name: hero.hero_name,
        hero_avatar: hero.hero_avatar,
        hero_role: hero.hero_role,
        hero_specially: hero.hero_specially,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Insert heroes into the database
      await queryInterface.bulkInsert("Heros", heroes, {});
      console.log(`${heroes.length} heroes successfully seeded`);
    } catch (error) {
      console.error("Error seeding heroes:", error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Heros", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
