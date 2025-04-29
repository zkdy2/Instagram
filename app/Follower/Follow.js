const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../auth/User');

const Follow = sequelize.define('Follow', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,  
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,  
    }
  }, {
    timestamps: false,  
    tableName: 'Follows'
  });
  

  Follow.belongsTo(User, { foreignKey: 'follower_id', as: 'follower' });
  Follow.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  module.exports = Follow;