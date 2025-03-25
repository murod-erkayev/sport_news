const {
  addNewLang,
  getALLlanguagesById,
  getALLlanguagestypes,
  Updatelangstypes,
  deletelangstypes,
} = require("../controllers/langs.controller");

const router = require("express").Router();

router.post("/", addNewLang);
router.get("/", getALLlanguagestypes);
router.get("/:id", getALLlanguagesById);
router.put("/:id", Updatelangstypes);
router.delete("/:id", deletelangstypes);

module.exports = router;
