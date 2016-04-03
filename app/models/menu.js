var mongoose     = require('mongoose');
var Schema       = mongoose.Schema,ObjectId = Schema.ObjectId;

var MenuSchema =  new mongoose.Schema({
cost: Number,
name : String,
type: String,
category: String,
veg:Boolean,
pic:String,
description:String,
enable:Boolean,
offerEnable:Boolean,
offerDiscount:Number
});

MenuSchema.virtual('food').get(function() {
    return this._id;
});
module.exports = mongoose.model('Menu', MenuSchema);
