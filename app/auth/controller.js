const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtOptions } = require("./passport");
const User = require("./User");

const saltRounds = 10;


const signUp = async (req, res) => {
  try {
    const { email, password, phone, full_name, username } = req.body;

    if (!email || !password || !phone || !username) {
      return res.status(400).json({
        error: "Пожалуйста, заполните обязательные поля: email, password, phone, username.",
      });
    }


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует." });
    }


    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ error: "Пользователь с таким номером телефона уже существует." });
    }


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      full_name,
      username,
    });

 
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        username: newUser.username,
      },
      jwtOptions.secretOrKey,
      { expiresIn: 24 * 60 * 60 } 
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Пользователь с таким email или номером телефона уже существует.",
      });
    }

    res.status(500).json({ error: "Ошибка сервера при создании пользователя." });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username,
      },
      jwtOptions.secretOrKey,
      { expiresIn: 24 * 60 * 60 }
    );

    res.status(200).json({ message: "Авторизация успешна", token });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    res.status(500).json({ error: "Ошибка сервера при авторизации" });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const { full_name, phone, username } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ where: { phone } });
      if (phoneExists) {
        return res.status(400).json({ error: "Номер телефона уже занят." });
      }
      user.phone = phone;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ error: "Имя пользователя уже занято." });
      }
      user.username = username;
    }

    if (full_name !== undefined) user.full_name = full_name;

    await user.save();
    res.json({ message: "Данные успешно обновлены", user });
  } catch (err) {
    console.error("Ошибка при обновлении профиля:", err);
    res.status(500).json({ error: "Ошибка сервера при обновлении данных пользователя" });
  }
};


const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'email', 'phone', 'full_name', 'username'], // не возвращаем пароль
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера при получении пользователя" });
  }
};

module.exports = {
  signUp,
  signIn,
  updateUserProfile,
  getUserByUsername
};
