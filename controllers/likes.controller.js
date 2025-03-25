const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

// Yangi like qo‘shish
const addLike = async (req, res) => {
  try {
    const { user_id, news_id } = req.body;
    const liked_at = new Date();

    const newLike = await pool.query(
      `INSERT INTO likes (user_id, news_id, liked_at) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, news_id, liked_at]
    );

    res
      .status(201)
      .json({ message: "Yangi like qo'shildi", like: newLike.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Barcha likelarni olish
const getAllLikes = async (req, res) => {
  try {
    const likes = await pool.query("SELECT * FROM likes");
    res.status(200).json({ message: "Barcha likelar", likes: likes.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Muayyan like'ni olish
const getLikeById = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query("SELECT * FROM likes WHERE id = $1", [id]);

    if (like.rows.length === 0) {
      return res.status(404).json({ message: "Like topilmadi" });
    }

    res.status(200).json({ message: "Like topildi", like: like.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Like'ni o‘chirish
const deleteLike = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query("SELECT * FROM likes WHERE id = $1", [id]);

    if (like.rows.length === 0) {
      return res.status(404).json({ message: "Like topilmadi" });
    }

    await pool.query("DELETE FROM likes WHERE id = $1", [id]);
    res.status(200).json({ message: "Like o‘chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addLike,
  getAllLikes,
  getLikeById,
  deleteLike,
};
