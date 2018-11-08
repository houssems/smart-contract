var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = require('./user');
const Signer = require('./signer');
const roles = require('./roles');

const contractorSchema = new Schema({
    contract: {
        name: {type: String},
        signers: [{ type: Schema.Types.ObjectId, ref: 'Signer' }],
        description: {type: String},
        file: {type: Buffer},
        submitted: {type: Boolean, default: false}
    }
});

module.exports = User.discriminator(roles.contractor, contractorSchema);