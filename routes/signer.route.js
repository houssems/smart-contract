const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const routeUtils = require('./route.utils');

router.get('/', routeUtils.isAuthenticated, function (req, res) {

    res.render('signer');
});

module.exports = router;