var mongoose     = require('mongoose');
var Schema       = mongoose.Schema,ObjectId = Schema.ObjectId;

var OrderSchema =  new mongoose.Schema({
    table: Number,
orderStatus:Number,
cost:Number,
    serve: [{
        food:ObjectId,
        quan:Number
      
    }]

});
module.exports = mongoose.model('Order', OrderSchema);
