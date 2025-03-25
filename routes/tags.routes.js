const {
  addNewTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} = require("../controllers/tags.controller");

const router = require("express").Router();

router.post("/", addNewTag);
router.get("/", getAllTags);
router.get("/:id", getTagById);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

module.exports = router;
