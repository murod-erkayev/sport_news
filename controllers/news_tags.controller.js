const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const Addnews_tags = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const news_tags = await pool.query(
      `INSERT INTO news_tags(news_id, tag_id)
        VALUES ($1, $2) RETURNING *
        `,
      [news_id, tag_id]
    );
    res
      .status(201)
      .send({ message: "Yangi news_tags qo'shildi", news: news_tags.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAllnews_tags = async (req, res) => {
  try {
    const news_tagsaall = await pool.query(`
        SELECT * FROM news_tags`);
    res.send(news_tagsaall.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};
const getnews_tagsById = async (req, res) => {
  try {
    const id = req.params.id;
    const news_tagssall = await pool.query(
      `
        SELECT * FROM news_tags where id=$1`,
      [id]
    );
    if (news_tagssall.rows.length === 0) {
      return res.status(404).send({ message: "news_tags topilmadi" });
    }

    res.send(news_tagssall.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};
const Updatenews_tags = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const id = req.params.id;
    const update = await pool.query(
      `UPDATE news_tags SET news_id=$1, user_id=$2 WHERE id=$3 RETURNING *
        VALUES ($1, $2,$3) RETURNING *
        `,
      [news_id, tag_id, id]
    );
    if (update.rowCount === 0) {
      return res.status(404).send({ message: "news_tags topilmadi" });
    }

    res.status(200).send({
      message: "Malumotlar muvaffaqqiyatli yangilandi",
      category: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};
const deletenews_tagsById = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query(
      "DELETE FROM news_tags WHERE id=$1 RETURNING *",
      [id]
    );

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "news_tags topilmadi" });
    }

    res.status(200).send({ message: "news_tags muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};
module.exports = {
  Addnews_tags,
  getAllnews_tags,
  getnews_tagsById,
  Updatenews_tags,
  deletenews_tagsById,
};
