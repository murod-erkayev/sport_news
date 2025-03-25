const { addLike, getAllLikes, getLikeById, deleteLike } = require("../controllers/likes.controller");

const router = require("express").Router();


router.post("/", addLike);
router.get("/", getAllLikes);
router.post("/:id", getLikeById);
router.post("/:id", deleteLike);

module.exports = router;