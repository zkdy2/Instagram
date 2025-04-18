const Post = require('./Post');
const User = require('../auth/User');

// 1. Получить все посты авторизованного пользователя
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.findAll({ where: { userId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении постов пользователя' });
  }
};

// 2. Получить все посты
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении всех постов' });
  }
};

// 3. Получить пост по ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении поста' });
  }
};

// 4. Удалить пост по ID
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });


    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к удалению этого поста' });
    }

    await post.destroy();
    res.json({ message: 'Пост удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении поста' });
  }
};
  //Создать пост
const createPost = async (req, res) => {
  try {
    const { image_url, description } = req.body;
    const userId = req.user.id;

    if (!image_url) {
      return res.status(400).json({ error: 'Необходимо указать image_url' });
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

// обновить пост
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, description } = req.body;

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Пост не найден' });

    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к редактированию этого поста' });
    }

    if (image_url !== undefined) post.image_url = image_url;
    if (description !== undefined) post.description = description;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении поста' });
  }
};


const getPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const posts = await Post.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (err) {
    console.error('Ошибка при получении постов по username:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении постов' });
  }
};

module.exports = {
  createPost,
  getMyPosts,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  getPostsByUsername
};
