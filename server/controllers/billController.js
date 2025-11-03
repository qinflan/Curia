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

    async getTrendingBills(req, res) {
        return BillService.getTrendingBills(req, res);
    }
    
    async getBillByStateReps(req, res) {
        return BillService.getBillByStateReps(req, res);
    }

}

module.exports = new BillController();