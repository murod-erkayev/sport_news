const { addNewAuthor, getAllAuthor, getAuthorById, updateAuthorById, deleteAuthorById } = require("../controllers/author.controller");



const router = require("express").Router();

router.post("/", addNewAuthor);
router.get("/", getAllAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;