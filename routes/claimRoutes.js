const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const claimController = require('../controllers/claimController');

router.post('/claims', ensureAuthenticated, claimController.createClaim);

router.get('/claims', ensureAuthenticated, claimController.getClaims);

module.exports = router;
