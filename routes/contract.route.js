const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({});
const routeUtils = require('./route.utils');
const blockchain = require('../services/blockchain.service');
const uuidv4 = require('uuid/v4');

router.get('/', routeUtils.isAuthenticated, function (req, res) {

    res.render('contractor');
});

router.post('/', upload.single('file'), routeUtils.isAuthenticated, function (req, res) {

    const title = req.body.title;
    const description = req.body.description;
    const signers = req.body.signers;
    const file = req.file;
    const userId = req.user.ID;

    console.log(title, description, signers);

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.render('contractor', {errors: errors});
        return;
    }

    const contract = {
        name: title,
        signers: signers,
        description: description,
        file: file.buffer
    };

    sendContractToThirdParties(req, res, contract, userId);
});


router.get('/become-signer', routeUtils.isAuthenticated, async function (req, res) {

    let userRegistered = await blockchain.findUserBy(req.user.email, 'email', 'signer');
    if (!userRegistered) {
        let userAsSigner = {...req.user, ID: uuidv4()};
        userRegistered = await blockchain.registerUser(userAsSigner, 'Signer');
    }

    if (userRegistered.ID) {
        req.session.passport.user.ID = userRegistered.ID;
        req.session.passport.user['$class'] = 'digital.contract.DocSigner';
        res.redirect('/signer/');
    }
});

function sendContractToThirdParties(req, res, contract, userId) {
    blockchain.sendContractData(contract, userId, function (err, response) {
        if (err) {
            req.flash('error_msg', err.toString());
            res.redirect('/contract/');
        } else {
            console.log('blockchain response =>', response);
            if (response && response.status) {
                if (parseInt(response.status) === 200) {
                    req.flash('success_msg', response.msg);
                    res.redirect('/contract/');
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