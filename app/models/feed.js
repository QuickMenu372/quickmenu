var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FeedSchema =  new mongoose.Schema({
    rating: Number,
    comment: String
});
module.exports = mongoose.model('Feed', FeedSchema);
