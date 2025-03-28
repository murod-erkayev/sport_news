const pool = require("../config/db");
const { errorHandler } = require("../helpers/error_handler");
const mailService = require("../servers/mail.service");
const config = require("config");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const { addMinutesDate } = require("../helpers/add_minutes");
const { encode } = require("../helpers/crypt");
const jwtService = require("../servers/jwt.service");
const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});
const addUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role,
      is_active,
      created_at,
      interests,
      bookmarks,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone_number,password, role, is_active, created_at, interests, bookmarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        hashedPassword,
        role,
        is_active,
        created_at,
        interests,
        bookmarks,
      ]
    );
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expriationTime = addMinutesDate(now, config.get("expiration_minute"));
    const newOtp = await pool.query(
      `
        INSERT INTO otp(id , otp , expiration_time)
        VALUES ($1 , $2 , $3)
        RETURNING id
        `,
      [uuid.v4(), otp, expriationTime]
    );
    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtp.rows[0].id,
    };
    const encodedData = await encode(JSON.stringify(details));
    console.log("OTp", otp);
    await mailService.sendActivationMail(newUser.rows[0].email, otp);
    res.status(201).send({
      message: "Yangi foydalanuvchi qo'shildi",
      encodedData,
      expriationTime,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    // console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse", result);
    console.log(DeviceHelper.isDesktop(result));
    const results = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    res.send(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.send(results.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      role,
      is_active,
      interests,
      bookmarks,
    } = req.body;

    const update = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone_number=$3,email=$4, password=$5, role=$6, is_active=$7, 
       interests=$8, bookmarks=$9 WHERE id=$10 RETURNING *`,
      [
        first_name,
        last_name,
        email,
        phone_number,
        password,
        role,
        is_active,
        interests,
        bookmarks,
        id,
      ]
    );

    if (update.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).send({
      message: "Foydalanuvchi muvaffaqqiyatli yangilandi",
      user: update.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (del.rowCount === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query(
      `
            SELECT * FROM users 
            WHERE email = $1
            `,
      [email]
    );
    if (userResult.rows.length == 0) {
      return res.status(400).send({ message: "Email yoki password xato!1" });
    }
    const user = userResult.rows[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki password xato!" });
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwtService.generateTokens(payload);
    const data = await pool.query(
      `
            UPDATE users SET refresh_token = $1 WHERE id = $2
            `,
      [token.refreshToken, user.id]
    );
    res.cookie("refresh_Token", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: token.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_Token;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Cookie da refresh token qaytarilmadi" });
    }
    const result = await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1 RETURNING *",
      [refreshToken]
    );
    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Bunday Tokenli Foydalanuvchi topilmadi" });
    }
    res.clearCookie("refresh____Token");
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};
const refreshTokenUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_Token;
    console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookie da refresh token qaytarilmadi" });
    }
    const decodedRefreshToken = await jwtService.verfiyRefreshToken(
      refreshToken
    );

    const user = await pool.query(
      `SELECT * FROM users WHERE refresh_token=$1`,
      [refreshToken]
    );
    if (!user) {
      return res
        .status(400)
        .send({ message: "Bunday Tokenli Foydalnuvchi topilmadi" });
    }
    const payload = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      is_active: user.rows[0].is_active,
    };
    const tokens = jwtService.generateTokens(payload);
    console.log(tokens);
    user.refresh_token = tokens.refreshToken;
    res.cookie("refreshToken", tokens.refreshToken, {
      httOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });
    res.send({
      message: "Tokenlar Yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logoutUser,
  refreshTokenUser,
};
