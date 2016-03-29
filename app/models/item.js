var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema =  new mongoose.Schema({
     img: 
      { data: Buffer, contentType: String }
  
});
module.exports = mongoose.model('Clothes', ItemSchema);
