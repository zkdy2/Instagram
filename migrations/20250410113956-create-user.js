'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создаем таблицу Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });

    // Создаем промежуточную таблицу для подписок
    await queryInterface.createTable('Subscriptions', {
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ссылаемся на таблицу Users
          key: 'id',
        },
        onDelete: 'CASCADE', // Удаление подписок при удалении пользователя
      },
      following_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем таблицы при откате
    await queryInterface.dropTable('Subscriptions');
    await queryInterface.dropTable('Users');
  },
};