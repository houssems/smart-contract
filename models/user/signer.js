var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');

const signerSchema = new Schema({
    contract: {
        file: {type: Buffer}
    }
});

module.exports = user.discriminator('Signer', signerSchema);