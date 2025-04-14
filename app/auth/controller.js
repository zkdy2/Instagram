const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtOptions } = require("./passport");
const User = require("./User");

const saltRounds = 10;

const signUp = async (req, res) => {
  try {
    // Получаем данные из тела запроса
    const { email, password, phone, full_name, username } = req.body;

    // Проверяем, что обязательные поля присутствуют
    if (!email || !password || !phone || !username) {
      return res
        .status(400)
        .json({
          error:
            "Пожалуйста, заполните все обязательные поля (email, password, phone, username).",
        });
    }

    // Хэшируем пароль с помощью bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создаем нового пользователя в базе данных с хэшированным паролем
    let newUser = await User.findOne({ where: { email: req.body.email } });
    if (!newUser) {
      newUser = await User.create({
        email,
        password: hashedPassword, // сохраняем хэшированный пароль
        phone,
        full_name,
        username,
      });
    }

    //Создаем новый токен для пользователя
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        username: newUser.username,
      },
      jwtOptions.secretOrKey,
      {
        expiresIn: 24 * 60 * 60,
      }
    );

    res.status(200).send({ token });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);

    // Если ошибка связана с уникальными полями (например, email или phone уже существуют)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({
          error:
            "Пользователь с таким email или номером телефона уже существует.",
        });
    }

    // Возвращаем общую ошибку
    res
      .status(500)
      .json({ error: "Ошибка сервера при создании пользователя." });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Сравниваем введенный пароль с хэшированным паролем в базе
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    // Если все верно, можно вернуть ответ с токеном или другим подтверждением
    res.status(200).json({ message: "Авторизация успешна", user });
  } catch (error) {
    console.error("Ошибка при авторизации:", error);
    res.status(500).json({ error: "Ошибка сервера при авторизации" });
  }
};

module.exports = {
  signUp,
  signIn,
};
