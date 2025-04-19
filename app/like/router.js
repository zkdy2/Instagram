const express = require("express");
const router = express.Router();
const likeController = require("./controller");
const authenticate = require("../auth/authMiddleware");

router.post("/api/like", authenticate, likeController.createLike);
router.delete("/api/like", authenticate, likeController.deleteLike);

module.exports = router;
