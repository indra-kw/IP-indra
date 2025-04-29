"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const favorites = [
      {
        UserId: 1, // User with email user1@mail.com
        HeroId: 1, // First hero
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 1, // User with email user1@mail.com
        HeroId: 2, // Second hero
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2, // User with email user2@mail.com
        HeroId: 3, // Third hero
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Favorites", favorites, {});
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
    await queryInterface.bulkDelete("Favorites", null, {
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
