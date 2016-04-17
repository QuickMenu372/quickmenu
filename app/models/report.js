var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReportSchema =  new mongoose.Schema({

    date: String,
    sales: Number
});
module.exports = mongoose.model('Report', ReportSchema);
