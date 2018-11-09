var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');
const roles = require('./roles');

const signerSchema = new Schema({
    contract: {
        file: {type: Buffer},
        submitted: {type: Boolean, default: false}
    }
});

module.exports = user.discriminator(roles.signer, signerSchema);