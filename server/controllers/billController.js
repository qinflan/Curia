const BillService = require('../services/bills');

class BillController {

    async getBillsByPolicyAreas(req, res) {
        return BillService.getBillsByPolicyAreas(req, res);
    }

    async getSavedBills(req, res) {
        return BillService.getSavedBills(req, res);
    }

    async getBillById(req, res) {
        return BillService.getBillById(req, res);
    }

    async likeBill(req, res) {
        return BillService.likeBill(req, res);
    }

    async dislikeBill(req, res) {
        return BillService.dislikeBill(req, res);
    }

    async unlikeBill(req, res) {
        return BillService.unlikeBill(req, res);
    }

    async undislikeBill(req, res) {
        return BillService.undislikeBill(req, res);
    }

    async getTrendingBills(req, res) {
        return BillService.getTrendingBills(req, res);
    }
    
    async getStateReps(req,res) {
        return BillService.getStateReps(req, res);
    }

    async getBillsByStateRep(req, res) {
        return BillService.getBillsByStateRep(req, res);
    }

    async searchBills(req, res) {
        return BillService.getBillsByKeywords(req, res);
    }

}

module.exports = new BillController();