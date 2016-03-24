var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema =  new mongoose.Schema({
    username:String,
    password: String,
    type:String
});
module.exports = mongoose.model('User', UserSchema);
