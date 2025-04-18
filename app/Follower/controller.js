const Follow = require('./Follow');
const User = require('../auth/User');

// Подписка
exports.followUser = async (req, res) => {
    const { followerUsername, targetUsername } = req.body;
  
    try {
      console.log('Follower Username:', followerUsername);
      console.log('Target Username:', targetUsername);
      if (!followerUsername || !targetUsername) {
        return res.status(400).json({ message: 'Both followerUsername and targetUsername are required' });
      }
      const follower = await User.findOne({ where: { username: followerUsername } });
      const target = await User.findOne({ where: { username: targetUsername } });
      if (!follower || !target) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (follower.id === target.id) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
      }
      const existingFollow = await Follow.findOne({
        where: { follower_id: follower.id, user_id: target.id }
      });
  
      if (existingFollow) {
        return res.status(400).json({ message: 'Already following this user' });
      }
      await Follow.create({ follower_id: follower.id, user_id: target.id });
      res.status(201).json({ message: 'Successfully followed the user' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message || error });
    }
  };
  

// Отписка
exports.unfollowUser = async (req, res) => {
    const { followerUsername, targetUsername } = req.body;
  
    try {
      const follower = await User.findOne({ where: { username: followerUsername } });
      const target = await User.findOne({ where: { username: targetUsername } });
  
      if (!follower || !target) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const follow = await Follow.findOne({
        where: { follower_id: follower.id, user_id: target.id }
      });
  
      if (!follow) {
        return res.status(404).json({ message: 'Not following this user' });
      }
  
      await follow.destroy();
      res.status(200).json({ message: 'Successfully unfollowed the user' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };


//подписчиков пользователя
exports.getFollowers = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = await Follow.findAll({
      where: { user_id: user.id },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'email']
      }]
    });

    const result = followers.map(f => f.follower);
    res.json(result);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

//подписок пользователя
exports.getFollowing = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = await Follow.findAll({
      where: { follower_id: user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      }]
    });

    const result = following.map(f => f.user);
    res.json(result);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

