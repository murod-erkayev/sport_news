const {
  Addnews_tags,
  getAllnews_tags,
  getnews_tagsById,
  Updatenews_tags,
  deletenews_tagsById,
} = require("../controllers/news_tags.controller");

const router = require("express").Router();

router.post("/", Addnews_tags);
router.get("/", getAllnews_tags);
router.get("/:id", getnews_tagsById);
router.put("/:id", Updatenews_tags);
router.delete("/:id", deletenews_tagsById);

module.exports = router;
