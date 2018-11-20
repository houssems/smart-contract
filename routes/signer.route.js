const express = require('express');
const router = express.Router();
const routeUtils = require('./route.utils');
const multer = require('multer');
const upload = multer({});
const blockchain = require('../services/blockchain.service');

router.get('/', routeUtils.isAuthenticated, function (req, res) {

    res.render('signer');
});

router.post('/', upload.single('file'), routeUtils.isAuthenticated, function (req, res) {
    const file = req.file;
    const userId = req.user.ID;
    const fileBase64Format = file.buffer.toString('base64');

    sendContractFileOfSigner(req, res, fileBase64Format, userId);
});

router.post('/verify', routeUtils.isAuthenticated, function (req, res) {
    const userId = req.user.ID;
    const docFingerPrint = req.body.docFingerPrint;

    console.log('change signer status => ', docFingerPrint, userId);

    blockchain.changeSignerStatus(docFingerPrint, userId, function (err, response) {
        if (err) {
            res.json({errors: err.toString()});
        }else {
            res.json(response);
        }
    })
});

router.post('/confirm-pin', routeUtils.isAuthenticated, function (req, res) {
    const userId = req.user.ID;
    const otp = req.body.otp;

    console.log('confirm PIN => ', otp, userId);

    blockchain.verifyPin(otp, userId, function (err, response) {
        if (err) {
            res.json({errors: err.toString()});
        }else {
            res.json(response);
        }
    })
});

/**
 *
 * response sample:
 * {
 *  "docTitle": "Contract01",
 *  "docDesc": "Trading Contract",
 *  "docIssuer": "001",
 *  "signerList": [
 *      {
 *        "docStatus": "NOT_SIGNED",
 *        "signerId": "010"
 *      }, {
 *        "docStatus": "SIGNED",
 *        "signerId": "011"
 *      }, {
 *        "docStatus": "NOT_SIGNED",
 *        "signerId": "012"
 *      }
 *   ]
 *  }
 */
function sendContractFileOfSigner(req, res, contractFile) {

    const userId = req.user.ID;
    console.log('userId => ', userId);
    blockchain.sendContractFileOfSigner(contractFile, async function (err, response) {
        if (err) {
            req.flash('error_msg', err.toString());
            res.redirect('/signer/');
        } else {
            console.log('blockchain response =>', response);
            if (response && response.docTitle) {

                const result = {
                    docTitle: response.docTitle,
                    docDesc: response.docDesc,
                    docFingerPrint: response.docFingerPrint,
                    hasAlreadySigned: false
                };

                result.issuer = await blockchain.findUserBy(response.docIssuer, 'ID');

                result.signerList = response.signerList.map(function (signer) {

                    if (signer.signerId === userId && signer.docStatus === 'SIGNED') {
                        console.log('already signed...');
                        result.hasAlreadySigned = true;
                    }

                    return {
                        docStatus: signer.docStatus,
                        name: signer.firstname + ' ' + signer.lastname
                    }
                });

                console.log(result.signerList);


                res.render('signer', {contract: result});

            } else {
                if (response && response.status) {
                    req.flash('error_msg', response.msg);
                }else {
                    req.flash('error_msg', 'An error has occurred while getting contract details.');
                }
                res.redirect('/signer/');
            }
        }
    });
}

module.exports = router;