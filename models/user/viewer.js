var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = require('./user');
const roles = require('./roles');

const viewerSchema = new Schema({

});

module.exports = user.discriminator(roles.viewer, viewerSchema);