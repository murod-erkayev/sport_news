const {
  addComment,
  getAllComments,
  getCommentById,
  deleteComment,
} = require("../controllers/comments.controller");

const router = require("express").Router();

router.post("/", addComment);
router.get("/", getAllComments);
router.post("/:id", getCommentById);
router.post("/:id", deleteComment);

module.exports = router;
