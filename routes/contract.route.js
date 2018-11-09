const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const upload = multer({});
const Contractor = require('../models/user/contractor');
const Signer = require('../models/user/signer');
const routeUtils = require('./route.utils');
const blockchain = require('../services/blockchain.service');

router.get('/', routeUtils.isAuthenticated, function (req, res) {

    if (req.query.retry) {
        sendContractToThirdParties(req, res, req.user.contract, req.user._id);
    } else {
        res.render('contractor');
    }
});

router.post('/', upload.single('file'), routeUtils.isAuthenticated, function (req, res) {

    const title = req.body.title;
    const description = req.body.description;
    const signers = req.body.signers;
    const file = req.file;
    const userId = req.user._id;

    console.log(title, description, signers);

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.render('contractor', {errors: errors});
        return;
    }

    Signer.find({
        '_id': {
            $in: signers.map(function (signer) {
                return mongoose.Types.ObjectId(signer);
            })
        }
    }, function (err, signerList) {
        console.log(signerList);
        const contract = {
            name: title,
            signers: signerList,
            description: description,
            file: file.buffer,
            submitted: false
        };
        Contractor.updateOne({_id: userId}, {
            contract: contract
        }, function (err, numberAffected, rawResponse) {
            console.log(err, rawResponse);

            if (err) {
                req.flash('error_msg', err.toString());
                res.redirect('/contract/');
                return;
            }
            sendContractToThirdParties(req, res, contract, userId);
        });
    })
});

function sendContractToThirdParties(req, res, contract, userId) {
    blockchain.sendContractData(contract, userId, function (err, response) {
        if (err) {
            req.flash('error_msg', err.toString());
            res.redirect('/contract/');
        } else {
            console.log(response);
            if (response && response.status) {
                if (response.status === '200') {
                    req.flash('success_msg', response.msg);
                    Contractor.updateOne({_id: userId}, {contract: {submitted: true}}, function () {
                        res.redirect('/contract/');
                    });
                }
                else {
                    req.flash('error_msg', response.msg);
                    res.redirect('/contract/');
                }
            }
        }
    });
}

module.exports = router;