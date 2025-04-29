const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../auth/User');
const Post = require('../post/Post');
const Story = require('../story/Story');

const Like = sequelize.define('Like', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'Likes',
});

Like.belongsTo(User, { foreignKey: 'user_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });
Like.belongsTo(Story, { foreignKey: 'story_id' });

module.exports = Like;
