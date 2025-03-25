const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");

// Yangi report qo‘shish
const addReport = async (req, res) => {
  try {
    const { user_id, news_id, reason, status } = req.body;
    const created_at = new Date();

    const newReport = await pool.query(
      `INSERT INTO reports (user_id, news_id, reason, status, created_at) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, news_id, reason, status, created_at]
    );

    res
      .status(201)
      .json({ message: "Yangi report qo'shildi", report: newReport.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Barcha reportlarni olish
const getAllReports = async (req, res) => {
  try {
    const reports = await pool.query("SELECT * FROM reports");
    res
      .status(200)
      .json({ message: "Barcha reportlar", reports: reports.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Muayyan reportni olish
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await pool.query("SELECT * FROM reports WHERE id = $1", [
      id,
    ]);

    if (report.rows.length === 0) {
      return res.status(404).json({ message: "Report topilmadi" });
    }

    res.status(200).json({ message: "Report topildi", report: report.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Reportni yangilash
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, status } = req.body;

    const updatedReport = await pool.query(
      `UPDATE reports SET reason = $1, status = $2 WHERE id = $3 RETURNING *`,
      [reason, status, id]
    );

    if (updatedReport.rows.length === 0) {
      return res.status(404).json({ message: "Report topilmadi" });
    }

    res
      .status(200)
      .json({ message: "Report yangilandi", report: updatedReport.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Reportni o‘chirish
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await pool.query("SELECT * FROM reports WHERE id = $1", [
      id,
    ]);

    if (report.rows.length === 0) {
      return res.status(404).json({ message: "Report topilmadi" });
    }

    await pool.query("DELETE FROM reports WHERE id = $1", [id]);
    res.status(200).json({ message: "Report o‘chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};
