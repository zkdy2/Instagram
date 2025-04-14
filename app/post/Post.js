const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../auth/User');  // Подключаем модель User

const Post = sequelize.define('Post', {
  image_url: { // Используем image_url, как в миграции
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: { // Связь с пользователем
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,  // createdAt и updatedAt включены
});

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Post;
