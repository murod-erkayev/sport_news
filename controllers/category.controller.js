const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addNewCategory = async (req, res) => {
  try {
    const { category_name, description, parent_id } = req.body;
    const newCategory = await pool.query(
      `INSERT INTO category(category_name, description, parent_id)
        VALUES ($1, $2, $3) RETURNING *`,
      [category_name, description, parent_id]
    );
    res
      .status(201)
      .send({
        message: "Yangi kategoriya qo'shildi",
        category: newCategory.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM category");
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategoryById = async (req, res) => {
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

const updateCategoryById = async (req, res) => {
  try {
    const { category_name, description, parent_id } = req.body;
    const id = req.params.id;

    const update = await pool.query(
      `UPDATE category SET category_name=$1, description=$2, parent_id=$3 WHERE id=$4 RETURNING *`,
      [category_name, description, parent_id, id]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Kategoriya topilmadi" });
    }

    res
      .status(200)
      .send({
        message: "Malumotlar muvaffaqqiyatli yangilandi",
        category: update.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
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
  addNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
