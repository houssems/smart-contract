const request = require('request');

// todo set url for blockchain
const contractorPostFileUrl = 'http://127.0.0.1/blockchain/contractor';

const signerPostFileUrl = 'http://127.0.0.1/blockchain/signer';


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
        }
    };

    console.log(postData);
    request(contractRequestBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
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
        }
    };

    console.log(postData);
    request(contractRequestBuilder, function (error, response) {
        let responseData = response;
        if (response && response.body) {
            responseData = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        }
        callback(error, responseData);

        // const responseData = {
        //     "docTitle": "ttttt",
        //     "docDesc": "tttttt",
        //     "docIssuer": "5be5d4f36e6f21133c4fb995",
        //     "signerList": [ {
        //         "docStatus": "NOT_SIGNED",
        //         "signerId": "5be360dcf95a7e1068c54395"
        //     }, {
        //         "docStatus": "SIGNED",
        //         "signerId": "5be4b776abb92f2094cae9c7"
        //     }],
        // };

        // callback(null, responseData);
    });
};