const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();
const routeUtils = require('./route.utils');
const multer = require('multer');
const upload = multer({});
const Signer = require('../models/user/signer');
const Contractor = require('../models/user/contractor');
const blockchain = require('../services/blockchain.service');

router.get('/', routeUtils.isAuthenticated, function (req, res) {

    res.render('signer');
});

router.post('/', upload.single('file'), routeUtils.isAuthenticated, function (req, res) {
    const file = req.file;
    const userId = req.user._id;
    const fileBase64Format = file.buffer.toString('base64');

    sendContractFileOfSigner(req, res, fileBase64Format, userId);

    // const contract = {
    //     file: fileBase64Format,
    //     submitted: false
    // };

    // Signer.updateOne({_id: userId}, {
    //     contract: contract
    // }, function (err, numberAffected, rawResponse) {
    //     console.log(err, rawResponse);
    //
    //     if (err) {
    //         req.flash('error_msg', err.toString());
    //         res.redirect('/contract/');
    //         return;
    //     }
    // });
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
    blockchain.sendContractFileOfSigner(contractFile, async function (err, response) {
        if (err) {
            req.flash('error_msg', err.toString());
            res.redirect('/signer/');
        } else {
            // console.log(response);
            if (response && response.docTitle) {

                const result = {
                    docTitle: response.docTitle,
                    docDesc: response.docDesc
                };

                result.issuer = await Contractor.findOne({_id: response.docIssuer}).select({"name": 1}).exec();

                let signerList = await Signer.find({
                    _id: {
                        $in: response.signerList.map(function (signer) {
                            return mongoose.Types.ObjectId(signer.signerId);
                        })
                    }
                }).select({"name": 1, '_id': 1}).exec();

                result.signerList = signerList.map(function (signer) {
                    const item = response.signerList.find(function (signerItem) {
                        return signerItem.signerId == signer._id.toString();
                    });

                    const res = {
                        docStatus: item.docStatus,
                        name: signer.name,
                        _id: signer._id
                    };

                    console.log('item:', res);

                    return res;
                });

                console.log(result.signerList);


                res.render('signer', {contract: result});

            } else {
                req.flash('error_msg', 'An error has occurred while getting contract details.');
                res.redirect('/signer/');
            }
        }
    });
}

module.exports = router;