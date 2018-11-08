var express = require('express');
var router = express.Router();

const Contractor = require('../models/user/contractor');
const Signer = require('../models/user/signer');

const routeUtils = require('./route.utils');

// Get Homepage
router.get('/', routeUtils.isAuthenticated, function(req, res){

	if (req.user instanceof Contractor) {
        res.redirect('/contract/');
	}

    if (req.user instanceof Signer) {
        res.redirect('/signer/');
    }

	// res.render('index');
});



module.exports = router;