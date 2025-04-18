const Story = require('./Story');
const User = require('../auth/User');
const { Op } = require('sequelize');

exports.addStory = async (req, res) => {
  const { username, user_id, story_content } = req.body;

  try {
    let user;
    if (username) {
      user = await User.findOne({ where: { username } });
    } else if (user_id) {
      user = await User.findByPk(user_id);
    } else {
      return res.status(400).json({ message: 'username or user_id is required' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newStory = await Story.create({
      user_id: user.id,
      story_content,
      story_date: new Date()
    });

    res.status(201).json({ message: 'Story added successfully', story: newStory });
  } catch (error) {
    console.error('Error adding story:', error);
    if (error.message.includes('invalid')) {
      return res.status(400).json({ message: 'Invalid parameter', error: error.message });
    }
    res.status(500).json({ message: 'Error adding story', error: error.message || error });
  }
};

// Пример с использованием параметра URL для story_id
exports.deleteStory = async (req, res) => {
    const { story_id } = req.params;  // Получаем story_id из параметров URL
  
    try {
      const user = req.user;  // Passport добавляет пользователя в req.user после успешной аутентификации
  
      if (!user) {
        return res.status(404).json({ message: 'User not found or unauthorized' });
      }
  
      // Ищем историю по ID
      const story = await Story.findByPk(story_id, {
        include: [{ model: User, as: 'user' }]
      });
  
      if (!story) {
        return res.status(404).json({ message: 'Story not found' });
      }
  
      // Проверяем, принадлежит ли история текущему пользователю
      if (story.user.id !== user.id) {
        return res.status(403).json({ message: 'User not authorized to delete this story' });
      }
  
      // Удаляем историю
      await story.destroy();
      res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
      console.error('Error deleting story:', error);
      res.status(500).json({ message: 'Error deleting story', error: error.message || error });
    }
  };  
  

exports.getUserStories = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stories = await Story.findAll({
      where: {
        user_id: user.id,
        story_date: {
          [Op.between]: [twentyFourHoursAgo, now]
        }
      },
      include: [{ model: User, as: 'user' }],
      order: [['story_date', 'DESC']]
    });

    if (stories.length === 0) {
      return res.status(200).json({ message: 'No stories found in the last 24 hours' });
    }

    res.status(200).json(stories);
  } catch (error) {
    console.error('Error retrieving stories:', error);
    res.status(500).json({ message: 'Error retrieving stories', error: error.message || error });
  }
};
