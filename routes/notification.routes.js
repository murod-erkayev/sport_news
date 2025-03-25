const { updateCategoryById } = require("../controllers/category.controller");
const { addNewNotification, getAllNotification, getNotificationById, updateNotificationById, deleteNotificationById } = require("../controllers/notification.controller");


const router = require("express").Router();

router.post("/", addNewNotification)
router.get("/", getAllNotification)
router.get("/:id", getNotificationById)
router.put("/:id", updateNotificationById)
router.delete("/:id", deleteNotificationById)


module.exports = router