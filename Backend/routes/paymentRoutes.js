const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/', auth, paymentController.createPayment);
router.get('/user/:userId', auth, paymentController.getPaymentsByUser);
router.put('/:id', auth, paymentController.updatePayment);
router.delete('/:id', auth, paymentController.deletePayment);

module.exports = router;
