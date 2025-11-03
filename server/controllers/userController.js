const UserService = require('../services/user');


class UserController {
    async registerUser(req, res) {
        return UserService.registerUser(req, res);
    }
    async loginUser(req, res) {
        return UserService.loginUser(req, res);
    }
    async refresh(req, res) {
        return UserService.refresh(req, res);
    }
    async getUser(req, res) {
        return UserService.getUser(req, res);
    }
    async deleteUser(req, res) {
        return UserService.deleteUser(req, res);
    }
    async updateUser(req, res) {
        return UserService.updateUser(req, res);
    }
    async saveBill(req, res) {
        return UserService.saveBill(req, res);
    }
    async unsaveBill(req, res) {
        return UserService.unsaveBill(req, res);
    }
}


module.exports = new UserController();