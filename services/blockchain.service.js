const request = require('request');

// todo set url for blockchain
const contractorPostFileUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/addDigitalContractJson';

const signerPostFileUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/VarifyDigitalContractJson';

const changeSignerStatusUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/SetSignerStatus';

const smsOTPUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/SetSignerStatus';


/**
 *
 * @param contract contract details
 * @param issuerId id of issuer
 * @param callback response WS
 * required format for blockchain
 * {
 *     "docPDF": "File Buffer",
 *     "docTitle": "Contract01",
 *     "docDesc": "Trading Contract",
 *     "docIssuer": "001",
 *     "signerList": [
 *     {
 *         "signerId": "010"
 *     },
 *     {
 *         "signerId": "011"
 *     },
 *     {
 *         "signerId": "012"
 *     }]
 * }
 */
module.exports.sendContractData = function (contract, issuerId, callback) {

    const postData = {
        docPDF: contract.file.toString('base64'),
        docTitle: contract.name,
        docDesc: contract.description,
        docIssuer: issuerId.toString(),
        signerList: contract.signers.map(function (signer) {
            return {signerId: signer._id.toString()};
        })
    };
    const contractRequestBuilder = {
        uri: contractorPostFileUrl,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    console.log(postData);
    request(contractRequestBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            try {
                responseData = JSON.parse(response.body);
            } catch (e) {
                responseData = response.body;
            }
        }
        callback(error, responseData);
    });
};


/**
 *
 * @param contractFile: string
 * @param callback: Function
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
module.exports.sendContractFileOfSigner = function (contractFile, callback) {

    const postData = {
        docPDF: contractFile
    };
    const contractRequestBuilder = {
        uri: signerPostFileUrl,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    console.log('sendContractFileOfSigner => ', contractRequestBuilder);

    request(contractRequestBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            try {
                responseData = JSON.parse(response.body);
            } catch (e) {
                responseData = response.body;
            }
        }
        callback(error, responseData);

    });
};


module.exports.changeSignerStatus = function (docFingerPrint, signerId, callback) {

    const postData = {
        docFingerPrint: docFingerPrint,
        signerId: signerId
    };
    const changeSignerStatusBuilder = {
        uri: changeSignerStatusUrl,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    console.log('changeSignerStatus => ', changeSignerStatusBuilder);

    request(changeSignerStatusBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            try {
                responseData = JSON.parse(response.body);
            } catch (e) {
                responseData = response.body;
            }
        }
        callback(error, responseData);
    });

};

module.exports.verifyPin = function (otp, signerId, callback) {

    const postData = {
        otp: otp,
        id: signerId
    };
    const verifyPinBuilder = {
        uri: smsOTPUrl,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    console.log('verifyPin =>', verifyPinBuilder);

    request(verifyPinBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            try {
                responseData = JSON.parse(response.body);
            } catch (e) {
                responseData = response.body;
            }
        }
        callback(error, responseData);
    });

};