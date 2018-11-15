var express = require('express');
var router = express.Router();

const routeUtils = require('./route.utils');

// Get Homepage
router.get('/', routeUtils.isAuthenticated, function(req, res){

	if (req.user['$class'] === 'digital.contract.DocIssuer') {
        res.redirect('/contract/');
	}

    if (req.user['$class'] === 'digital.contract.DocSigner') {
        res.redirect('/signer/');
    }

	// res.render('index');
});



module.exports = router;