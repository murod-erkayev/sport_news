const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");


const addComment = async (req, res) => {
  try {
    const { user_id, news_id, content, reply_comment_id } = req.body;
    const created_at = Math.floor(Date.now() / 1000); 

    const newComment = await pool.query(
      `INSERT INTO comments (user_id, news_id, content, created_at, reply_comment_id, is_approved, is_deleted, views, likes) 
       VALUES ($1, $2, $3, $4, $5, FALSE, FALSE, 0, 0) 
       RETURNING *`,
      [user_id, news_id, content, created_at, reply_comment_id]
    );

    res
      .status(201)
      .json({ message: "Yangi izoh qo'shildi", comment: newComment.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await pool.query(
      "SELECT * FROM comments WHERE is_deleted = FALSE"
    );
    res
      .status(200)
      .json({ message: "Barcha izohlar", comments: comments.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [
      id,
    ]);

    if (comment.rows.length === 0) {
      return res.status(404).json({ message: "Izoh topilmadi" });
    }

    res.status(200).json({ message: "Izoh topildi", comment: comment.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_approved } = req.body;

    const updatedComment = await pool.query(
      `UPDATE comments SET content = $1, is_approved = $2 WHERE id = $3 RETURNING *`,
      [content, is_approved, id]
    );

    if (updatedComment.rows.length === 0) {
      return res.status(404).json({ message: "Izoh topilmadi" });
    }

    res
      .status(200)
      .json({ message: "Izoh yangilandi", comment: updatedComment.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};


const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [
      id,
    ]);

    if (comment.rows.length === 0) {
      return res.status(404).json({ message: "Izoh topilmadi" });
    }

    await pool.query("DELETE FROM comments WHERE id = $1", [id]);
    res.status(200).json({ message: "Izoh o‘chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
