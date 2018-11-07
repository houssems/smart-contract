var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');

const contractorSchema = new Schema({
    contract: {
        name: {type: String},
        description: {type: String},
        file: {type: Buffer}
    }
});

module.exports = user.discriminator('Contractor', contractorSchema);