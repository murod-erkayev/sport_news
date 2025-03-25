const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

const addUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, is_active, created_at, interests, bookmarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
      ]
    );

    res
      .status(201)
      .send({
        message: "Yangi foydalanuvchi qo'shildi",
        user: newUser.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      interests,
      bookmarks,
    } = req.body;

    const update = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, role=$5, is_active=$6, 
       interests=$7, bookmarks=$8 WHERE id=$9 RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        interests,
        bookmarks,
        id,
      ]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({
        message: "Foydalanuvchi muvaffaqqiyatli yangilandi",
        user: update.rows[0],
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
