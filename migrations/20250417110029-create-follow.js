'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Follows', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
      },
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,  
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Follows');
  }
};
