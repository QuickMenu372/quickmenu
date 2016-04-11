var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RequestSchema =  new mongoose.Schema({
table:Number,
    type: String,
    comment: String
});
module.exports = mongoose.model('Request', RequestSchema);
