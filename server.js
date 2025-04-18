const express = require("express");
const logger = require("morgan");
const passport = require("passport");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded());
app.use(express.json());
app.use(passport.initialize());

require("./app/auth/passport");

app.use(require("./app/auth/routes"));
app.use(require("./app/post/router"));
app.use(require("./app/story/router"));
app.use(require("./app/Follower/router"));
app.use(require("./app/like/router"));

app.listen(3000, () => {
  console.log("Server is listen on PORT");
});
