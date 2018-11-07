var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');

const adminSchema = new Schema({

});

module.exports = user.discriminator('Admin', adminSchema);