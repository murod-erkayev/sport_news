const { createOtp, verifiOtp } = require("../controllers/otp.controller");

const router = require("express").Router();

router.post("/createotp", createOtp);
router.post("/verifyotp", verifiOtp);

module.exports = router;
