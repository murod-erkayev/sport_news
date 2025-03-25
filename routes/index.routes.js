const router = require("express").Router();

const langsRoute = require("./langs.routes");

router.use("/tags", require("./tags.routes"));
router.use("/category", require("./category.routes"));
router.use("/news", require("./news.routes"));
router.use("/news_with_langs", require("./news_with_langs.routes"));
router.use("/users", require("./users.routes"));
router.use("/langs", langsRoute);
router.use("/media", require("./media.routes"));
router.use("/likes", require("./likes.routes"));
router.use("/reports", require("./reports.routes"));
router.use("/comments", require("./commentes.routes"));
router.use("/views", require("./views.routes"));
module.exports = router;
  