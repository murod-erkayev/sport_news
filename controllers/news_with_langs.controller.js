const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNewsTag = async (req, res) => {
  try {
    const { title, content, summary_news, lang_id } = req.body;
    const newNewsTag = await pool.query(
      `INSERT INTO news_with_langs(title, content,summary_news,lang_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, summary_news, lang_id]
    );
    res
      .status(201)
      .send({
        message: "Yangi bog'lanish qo'shildi",
        newsTag: newNewsTag.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNewsTags = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM news_with_langs");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNewsTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query(
      "SELECT * FROM news_with_langs WHERE id = $1",
      [id]
    );

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNewsTag = async (req, res) => {
  try {
    const { title, content, summary_news, lang_id } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE news_with_langs SET title=$1, content=$2, summary_news=$3, lang_id=$4 WHERE id=$5 RETURNING *`,
      [title, content, summary_news, lang_id, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res
      .status(200)
      .send({
        message: "Malumot muvaffaqqiyatli yangilandi",
        newsTag: update.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNewsTag = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query(
      "DELETE FROM news_with_langs WHERE id=$1 RETURNING *",
      [id]
    );

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Bog'lanish topilmadi" });
    }

    res.status(200).send({ message: "Bog'lanish muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewNewsTag,
  getAllNewsTags,
  getNewsTagById,
  updateNewsTag,
  deleteNewsTag,
};
