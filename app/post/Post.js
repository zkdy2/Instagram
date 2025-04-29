const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../auth/User');

const Post = sequelize.define('Post', {
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Post;
