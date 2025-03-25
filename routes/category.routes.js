const { addNewCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require("../controllers/category.controller");


const router = require("express").Router();

router.post("/", addNewCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
