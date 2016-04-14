var mongoose     = require('mongoose');
var Schema       = mongoose.Schema,ObjectId = Schema.ObjectId;

var BillSchema =  new mongoose.Schema({
    id:String,
    cost:Number,
    serve: [{
        food:ObjectId,
        quan:Number,

      
    }]

});
module.exports = mongoose.model('Bill', BillSchema);
