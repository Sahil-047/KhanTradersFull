const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const auth = require('../middleware/auth');

router.post('/', auth, bankController.createBank);
router.get('/', auth, bankController.getBanks);
router.get('/:id', auth, bankController.getBankById);
router.get('/user/:userId', auth, bankController.getBanksByUser);
router.put('/:id', auth, bankController.updateBank);
router.delete('/:id', auth, bankController.deleteBank);

module.exports = router;
