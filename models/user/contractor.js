var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const user = require('./user');
const roles = require('./roles');

const contractorSchema = new Schema({
    contract: {
        name: {type: String},
        description: {type: String},
        file: {type: Buffer}
    }
});

module.exports = user.discriminator(roles.contractor, contractorSchema);