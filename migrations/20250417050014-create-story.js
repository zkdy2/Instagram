'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создаем таблицу Stories
   // внутри up:
await queryInterface.createTable('Stories', {
  story_id: { /*...*/ },
  user_id: { /*...*/ },
  story_content: { /*...*/ },
  story_date: { /*...*/ },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Stories');
  },
};
