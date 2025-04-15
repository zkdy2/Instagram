const Post = require('./Post');

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

module.exports = {
  createPost,
  getMyPosts,
  getAllPosts,
  getPostById,
  deletePost
};
