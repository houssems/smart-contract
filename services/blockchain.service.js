const request = require('request');

// todo set url for blockchain
const contractorPostFileUrl = 'http://127.0.0.1/blockchain/contractor';


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
        docPDF: contract.file,
        docTitle: contract.name,
        docDesc: contract.description,
        docIssuer: issuerId,
        signerList: contract.signers.map(function (signer) {
            return {signerId: signer._id};
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
            responseData = response.body === 'string' ? JSON.parse(response.body) : response.body;
        }
        callback(error, responseData);
    });
};