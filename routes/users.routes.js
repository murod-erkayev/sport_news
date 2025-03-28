const { addUser, getAllUsers, getUserById, updateUser, deleteUser, logoutUser, login, refreshTokenUser } = require("../controllers/users.controller");


const router = require("express").Router();

router.post("/", addUser);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
