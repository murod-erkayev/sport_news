const { addNewNewsTag, getAllNewsTags, getNewsTagById, updateNewsTag, deleteNewsTag } = require("../controllers/news_with_langs.controller");


const router = require("express").Router();

router.post("/", addNewNewsTag);
router.get("/", getAllNewsTags);
router.get("/:id", getNewsTagById);
router.put("/:id", updateNewsTag);
router.delete("/:id", deleteNewsTag);

module.exports = router;
