const {
  addReport,
  getAllReports,
  getReportById,
  deleteReport,
} = require("../controllers/report.controller");

const router = require("express").Router();

router.post("/", addReport);
router.get("/", getAllReports);
router.post("/:id", getReportById);
router.post("/:id", deleteReport);

module.exports = router;
