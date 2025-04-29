const Like = require("./Like");
const User = require("../auth/User");

exports.createLike = async (req, res) => {
  const userId = req.user.id; 
  const { postId, storyId } = req.body;

  try {
    if (!postId && !storyId) {
      return res.status(400).json({ message: "Нужно указать postId или storyId" });
    }

    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postId || null,
        story_id: storyId || null,
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Like уже существует" });
    }

    const like = await Like.create({
      user_id: userId,
      post_id: postId || null,
      story_id: storyId || null,
    });

    res.status(201).json({ message: "Like создан", like });
  } catch (error) {
    console.error("Ошибка при создании Like:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.deleteLike = async (req, res) => {
  const userId = req.user.id;
  const { postId, storyId } = req.body;

  try {
    const like = await Like.findOne({
      where: {
        user_id: userId,
        post_id: postId || null,
        story_id: storyId || null,
      },
    });

    if (!like) {
      return res.status(404).json({ message: "Like не найден" });
    }

    await like.destroy();
    res.status(200).json({ message: "Like удалён" });
  } catch (error) {
    console.error("Ошибка при удалении Like:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
