

const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewAuthor = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO category(user_id, is_approved, is_editor)
        VALUES ($1, $2, $3) RETURNING *`,
      [user_id, is_approved, is_editor]
    );
    res.status(201).send({
      message: "Yangi kategoriya qo'shildi",
      category: newCategory.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllAuthor = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM category");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorById = async (req, res) => {
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

const updateAuthorById = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;
    const id = req.params.id;
    const update = await pool.query(
      `UPDATE category SET user_id=$1, is_approved=$2, is_editor=$3 WHERE id=$4 RETURNING *`,
      [user_id, is_approved, is_editor, id]
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

const deleteAuthorById = async (req, res) => {
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
    addNewAuthor,
    getAuthorById,
    getAllAuthor,
    deleteAuthorById,
    updateAuthorById
};
