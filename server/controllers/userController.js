const UserService = require('../services/user');


class UserController {
    async registerUser(req, res) {
        return UserService.registerUser(req, res);
    }
    async loginUser(req, res) {
        return UserService.loginUser(req, res);
    }
}


module.exports = new UserController();