const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


class JWT {

    async generateAccessToken(req, res) {
        const {userId, email} = req
        jwt.sign({userId, email})

    }

    async generateRefreshToken(req, res) {
        
    }

    async verifyAccessToken(req, res) {
        const token = req
    }

    async verifyRefreshToken(req, res) {
        const token = req

    }

}

module.exports = new JWT()