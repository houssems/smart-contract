var express = require('express');
var router = express.Router();

var Contractor = require('../models/user/contractor');

const routeUtils = require('./route.utils');

// Get Homepage
router.get('/', routeUtils.isAuthenticated, function(req, res){

	if (req.user instanceof Contractor) {
        res.redirect('/contract/');
	}

	// res.render('index');
});



module.exports = router;