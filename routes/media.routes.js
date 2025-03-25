const { AddNewMedia } = require("../controllers/media.controller");

const router = require("express").Router();

router.post("/", AddNewMedia);

module.exports = router