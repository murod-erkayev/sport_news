const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNews = async (req, res) => {
  try {
    const {
      news_id,
      category_id,
      author_id,
      status,
      published_at,
      source,
      lang_id,
    } = req.body;

    const newNews = await pool.query(
      `INSERT INTO news (news_id, category_id, author_id, status, published_at, source, lang_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [news_id, category_id, author_id, status, published_at, source, lang_id]
    );

    res
      .status(201)
      .send({ message: "Yangi yangilik qo'shildi", news: newNews.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNews = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM news ORDER BY published_at DESC"
    );
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM news WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Yangilik topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNews = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      news_id,
      category_id,
      author_id,
      status,
      published_at,
      source,
      lang_id,
    } = req.body;

    const update = await pool.query(
      `UPDATE news SET news_id=$1, category_id=$2, author_id=$3, status=$4, 
       published_at=$5, source=$6, lang_id=$7 WHERE id=$8 RETURNING *`,
      [
        news_id,
        category_id,
        author_id,
        status,
        published_at,
        source,
        lang_id,
        id,
      ]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Yangilik topilmadi" });
    }

    res.status(200).send({
      message: "Yangilik muvaffaqqiyatli yangilandi",
      news: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM news WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Yangilik topilmadi" });
    }

    res.status(200).send({ message: "Yangilik muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
