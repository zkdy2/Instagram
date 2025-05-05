require("dotenv").config(); // Всегда загружай .env в самом начале
const updateFirewall = require('./scripts/updateFirewall');

const express = require("express");
const logger = require("morgan");
const passport = require("passport");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

require("./app/auth/passport");

app.use(require("./app/auth/routes"));
app.use(require("./app/post/router"));
app.use(require("./app/story/router"));
app.use(require("./app/Follower/router"));
app.use(require("./app/like/router"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
