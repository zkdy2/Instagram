const Post = require('./Post');

const createPost = async (req, res) => {
  try {
    const { image_url, description, userId } = req.body; // Получаем userId из тела запроса

    if (!image_url) {
      return res.status(400).json({ error: 'Необходимо указать image_url' });
    }

    if (!userId) { // Проверяем, что userId присутствует
      return res.status(400).json({ error: 'Необходимо указать userId' });
    }

    const post = await Post.create({
      image_url,  
      description,
      userId,     
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании поста' });
  }
};

module.exports = { createPost };
