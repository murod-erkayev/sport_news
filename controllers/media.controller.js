const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const AddNewMedia = async (req, res) => {
  try {
    const { news_id, media_type, media_url } = req.body;
    const media = await pool.query(
      `
      INSERT INTO media(news_id, media_type, media_url)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [news_id, media_type, media_url]
    );
    res
      .status(201)
      .send({ message: "Yangi Malumot Qoshildi", media: media.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllMedia = async (req, res) => {
  try {
    const media = await pool.query("SELECT * FROM media");
    res.status(200).send({ message: "Get ALL Media", media: media.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const UpdateMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const { news_id, media_type, media_url } = req.body;
    const updateMedia = await pool.query(
      `
      UPDATE media SET news_id=$1, media_type=$2, media_url=$3 WHERE id=$4
      RETURNING *
      `,
      [news_id, media_type, media_url, id]
    );
    res
      .status(200)
      .send({ message: "Update Media", media: updateMedia.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getByIdMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const getIdMedia = await pool.query("SELECT * FROM media WHERE id = $1", [
      id,
    ]);
    res
      .status(200)
      .send({ message: "Get By Id Media", media: getIdMedia.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteMedia = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM media WHERE id = $1", [id]);
    res.status(200).send({ message: "Delete Successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports =  {
  AddNewMedia,
  getAllMedia,
  UpdateMedia,
  getByIdMedia,
  deleteMedia,
};
