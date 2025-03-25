const { addNews, getAllNews, getNewsById, updateNews, deleteNews } = require("../controllers/news.controller");


const router = require("express").Router();

router.post("/", addNews);
router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

module.exports = router;
