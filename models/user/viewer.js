var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');

const viewerSchema = new Schema({

});

module.exports = user.discriminator('Viewer', viewerSchema);