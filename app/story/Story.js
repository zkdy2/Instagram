const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('../auth/User'); 

const Story = sequelize.define('Story', {
  story_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id',
    },
    onDelete: 'CASCADE',  
  },
  story_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  story_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, 
  },
}, {
  timestamps: false,  
});


Story.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Story;
