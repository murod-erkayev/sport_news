const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewNotification = async (req, res) => {
  try {
    const { user_id, news_id, msg_type, is_checked, create_at } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO category(user_id, news_id, msg_type,is_checked,create_at)
        VALUES ($1, $2, $3 ,$4 ,$5) RETURNING *`,
      [user_id, news_id, msg_type, is_checked, create_at]
    );
    res.status(201).send({
      message: "Yangi kategoriya qo'shildi",
      category: newCategory.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllNotification = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM category");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getNotificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM category WHERE id = $1", [
      id,
    ]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Kategoriya topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateNotificationById = async (req, res) => {
  try {
    const { user_id, news_id, msg_type, is_checked, create_at } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE category SET user_id=$1, news_id=$2, msg_type=$3, is_checked=$4,create_at=$5 WHERE id=$6 RETURNING *`,
      [category_name, description, parent_id, id]
    );
    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Kategoriya topilmadi" });
    }

    res.status(200).send({
      message: "Malumotlar muvaffaqqiyatli yangilandi",
      category: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteNotificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query(
      "DELETE FROM category WHERE id=$1 RETURNING *",
      [id]
    );

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Kategoriya topilmadi" });
    }

    res.status(200).send({ message: "Kategoriya muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
    addNewNotification,
    getAllNotification,
    getNotificationById,
    deleteNotificationById,
    updateNotificationById
};
