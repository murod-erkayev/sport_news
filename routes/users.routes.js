const { addUser, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/users.controller");


const router = require("express").Router();

router.post("/", addUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
