const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


class JWT {

    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1m" });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            throw new Error("Invalid or expired access token");
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new Error("Invalid or expired access token");
        }
    }

}

module.exports = new JWT()