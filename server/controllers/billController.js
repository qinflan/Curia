const BillService = require('../services/bills');

class BillController {

    async getBillsByPolicyAreas(req, res) {
        return BillService.getBillsByPolicyAreas(req, res);
    }

    async getSavedBills(req, res) {
        return BillService.getSavedBills(req, res);
    }

    async likeBill(req, res) {
        return BillService.likeBill(req, res);
    }

    async dislikeBill(req, res) {
        return BillService.dislikeBill(req, res);
    }

}

module.exports = new BillController();