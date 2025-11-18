const express = require('express');
const router = express.Router();
const BillController = require('../controllers/billController');
const { authenticateAccessToken } = require('../middleware/validateJWT');

router.get('/recommendations', authenticateAccessToken, BillController.getBillsByPolicyAreas);
router.put('/:billId/like', authenticateAccessToken, BillController.likeBill);
router.put('/:billId/unlike', authenticateAccessToken, BillController.unlikeBill);
router.put('/:billId/undislike', authenticateAccessToken, BillController.undislikeBill);
router.put('/:billId/dislike', authenticateAccessToken, BillController.dislikeBill);
router.get('/saved', authenticateAccessToken, BillController.getSavedBills);
router.get('/trending', authenticateAccessToken, BillController.getTrendingBills);
router.get('/reps/:state', authenticateAccessToken, BillController.getStateReps);
router.get('/rep/:bioguideId', authenticateAccessToken, BillController.getBillsByStateRep);
router.get('/search', authenticateAccessToken, BillController.searchBills);

module.exports = router;