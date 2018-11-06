var mongoose = require('mongoose');

var contractSchema = mongoose.Schema({
    name: {
        type: String
    },
	description: { type: String },

});

module.exports = mongoose.model('Contract', contractSchema);