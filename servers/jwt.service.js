const config = require("config");
const jwt = require("jsonwebtoken");

class JwtServeice {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async verfiyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }
  async verfiyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

module.exports = new JwtServeice(
  config.get("access_key"),
  config.get("refresh_key"),
  config.get("access_time"),
  config.get("refresh_time")
);
