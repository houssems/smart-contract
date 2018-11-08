var express = require('express');
var router = express.Router();

var Contractor = require('../models/user/contractor');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){

	console.log(req.user);
	console.log(req.user instanceof Contractor);

	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;