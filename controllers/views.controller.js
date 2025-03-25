const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

// Yangi view qo‘shish
const addView = async (req, res) => {
  try {
    const { user_id, news_id } = req.body;
    const viewed_at = new Date();

    const newView = await pool.query(
      `INSERT INTO views (user_id, news_id, viewed_at) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, news_id, viewed_at]
    );

    res
      .status(201)
      .json({ message: "Yangi view qo'shildi", view: newView.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Barcha viewlarni olish
const getAllViews = async (req, res) => {
  try {
    const views = await pool.query("SELECT * FROM views");
    res.status(200).json({ message: "Barcha views", views: views.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Muayyan view'ni olish
const getViewById = async (req, res) => {
  try {
    const { id } = req.params;
    const view = await pool.query("SELECT * FROM views WHERE id = $1", [id]);

    if (view.rows.length === 0) {
      return res.status(404).json({ message: "View topilmadi" });
    }

    res.status(200).json({ message: "View topildi", view: view.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// View'ni o‘chirish
const deleteView = async (req, res) => {
  try {
    const { id } = req.params;
    const view = await pool.query("SELECT * FROM views WHERE id = $1", [id]);

    if (view.rows.length === 0) {
      return res.status(404).json({ message: "View topilmadi" });
    }

    await pool.query("DELETE FROM views WHERE id = $1", [id]);
    res.status(200).json({ message: "View o‘chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};
// View'ni yangilash
const updateView = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, news_id } = req.body;
    const viewed_at = new Date(); // Yangilangan vaqt

    const view = await pool.query("SELECT * FROM views WHERE id = $1", [id]);
    if (view.rows.length === 0) {
      return res.status(404).json({ message: "View topilmadi" });
    }

    const updatedView = await pool.query(
      `UPDATE views 
       SET user_id = $1, news_id = $2, viewed_at = $3 
       WHERE id = $4 
       RETURNING *`,
      [user_id, news_id, viewed_at, id]
    );

    res.status(200).json({ message: "View yangilandi", view: updatedView.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};


module.exports = {
  addView,
  getAllViews,
  getViewById,
  deleteView,
  updateView
};

