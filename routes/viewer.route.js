const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({});
const blockchain = require('../services/blockchain.service');

router.get('/', function (req, res) {

    res.render('viewer');
});

router.post('/', upload.single('file'), function (req, res) {
    const file = req.file;
    const fileBase64Format = file.buffer.toString('base64');

    sendContractFileOfViewer(req, res, fileBase64Format);
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
function sendContractFileOfViewer(req, res, contractFile) {
    blockchain.sendContractFileOfSigner(contractFile, async function (err, response) {
        if (err) {
            req.flash('error_msg', err.toString());
            res.redirect('/viewer/');
        } else {
            console.log('blockchain response =>', response);
            if (response && response.docTitle) {

                const result = {
                    docTitle: response.docTitle,
                    docDesc: response.docDesc,
                    docFingerPrint: response.docFingerPrint
                };

                result.issuer = await blockchain.findUserBy(response.docIssuer, 'ID');

                result.signerList = response.signerList.map(async function (signer) {
                    return {
                        docStatus: signer.docStatus,
                        name: signer.firstname + ' ' + signer.lastname
                    }
                });


                res.render('viewer', {contract: result});

            } else {
                if (response && response.status) {
                    req.flash('error_msg', response.msg);
                }else {
                    req.flash('error_msg', 'An error has occurred while getting contract details.');
                }
                res.redirect('/viewer/');
            }
        }
    });
}

module.exports = router;