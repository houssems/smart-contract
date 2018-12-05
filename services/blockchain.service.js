const request = require('request');

// todo set url for blockchain
const contractorPostFileUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/addDigitalContractJson';

const signerPostFileUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/VarifyDigitalContractJson';

const changeSignerStatusUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/SetSignerStatus';

const smsOTPUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/smsOTP';

const signatoryListUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/getListOfSigners';
const issuerListUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/getListOfIssuers';
const registerIssuerUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/registerIssuer';
const registerSignerUrl = 'https://digital-contract-app.eu-gb.mybluemix.net/registerSigner';


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
function sendContractData (contract, issuerId, callback) {

    const postData = {
        docPDF: contract.file.toString('base64'),
        docMetadata: contract.metadata,
        docTitle: contract.name,
        docDesc: contract.description,
        docIssuer: issuerId.toString(),
        signerList: contract.signers.map(function (signer) {
            return {signerId: signer};
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
function sendContractFileOfSigner (contractFile, callback) {

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

    // request(contractRequestBuilder, function (error, response) {
    //     let responseData = response;
    //     if (response && response.body) {
    //         try {
    //             responseData = JSON.parse(response.body);
    //         } catch (e) {
    //             responseData = response.body;
    //         }
    //     }
    //     callback(error, responseData);
    //
    // });

    const responseData = {
        "docTitle": "ttttt",
        "docDesc": "tttttt",
        "docIssuer": "5be5d4f36e6f21133c4fb995",
        "signerList": [ {
            "docStatus": "NOT_SIGNED",
            "signerId": "5be360dcf95a7e1068c54395"
        }, {
            "docStatus": "SIGNED",
            "signerId": "f11c4f57-8373-4eff-acfa-c0514e04466f"
        }],
    };

    callback(null, responseData);
};


function changeSignerStatus (docFingerPrint, signerId, callback) {

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

function verifyPin (otp, signerId, callback) {

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

}

/**
 * {
 *  "firstname": "string",
 *  "lastname": "string",
 *  "title": "string",
 *  "email": "string",
 *  "mobile": "string",
 *  "ID": "string"
 * }
 */
function registerUser (user, role) {

    const url = (role === 'Contractor') ? registerIssuerUrl : registerSignerUrl;
    const registerUserBuilder = {
        uri: url,
        body: JSON.stringify(user),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    return new Promise(function(resolve, reject) {
        request(registerUserBuilder, function (error, response) {
            if (error) {
                reject(error);
            }else {
                let responseData = response;
                if (response && response.body) {
                    try {
                        responseData = JSON.parse(response.body);
                    } catch (e) {
                        responseData = response.body;
                    }
                }
                resolve(responseData);
            }
        });
    });
}

function getIssuerList () {
    const issuerLisBuilder = {
        uri: issuerListUrl,
        method: 'GET',
        timeout: 30000
    };


    return new Promise(function(resolve, reject) {
        request(issuerLisBuilder, function (error, response) {
            if (error) {
                reject(error);
            }else {
                let responseData = response;
                if (response && response.body) {
                    try {
                        responseData = JSON.parse(response.body);
                    } catch (e) {
                        responseData = response.body;
                    }
                }
                resolve(responseData);
            }
        });
    });
}

function getSignatoryList () {
    const signatoryListBuilder = {
        uri: signatoryListUrl,
        method: 'GET',
        timeout: 30000
    };

    return new Promise(function(resolve, reject) {
        request(signatoryListBuilder, function (error, response) {
            if (error) {
                reject(error);
            }else {
                let responseData = response;
                if (response && response.body) {
                    try {
                        responseData = JSON.parse(response.body);
                    } catch (e) {
                        responseData = response.body;
                    }
                }
                resolve(responseData);
            }
        });
    });
}

/**
 *
 * @param value
 * @param attribute
 * @param concernedUserClass
 * @returns {Promise<void>}
 */
async function findUserBy(value, attribute = 'email', concernedUserClass = 'all') {
    const signers = await getSignatoryList();
    const issuers = await getIssuerList();

    let usersList = [];
    switch(concernedUserClass) {
        case 'signer': usersList = [signers]; break;
        case 'issuer': usersList = [issuers]; break;

        default: usersList = [signers, issuers];
    }

    let userFound;

    usersList.forEach(function (userGroup) {
        if (typeof userGroup === 'object') {
            const user = userGroup.find(function (user) {
                return user[attribute] === value;
            });

            if (user) {
                userFound = user;
            }
        }
    });

    return userFound;
}



module.exports = {
    findUserBy,
    getSignatoryList,
    getIssuerList,
    sendContractData,
    registerUser,
    verifyPin,
    changeSignerStatus,
    sendContractFileOfSigner
};