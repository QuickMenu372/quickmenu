var express = require(‘express’);
var fs = require(‘fs’);
var mongoose = require(‘mongoose’);
var Schema = mongoose.Schema;
var multer = require('multer');

 var uri = process.env.MONGOLAB_URI||'mongodb://localhost:27017/menutest10';
mongoose.connect(uri);


var Item = new ItemSchema(
  { img: 
      { data: Buffer, contentType: String }
  }
);
var Item = mongoose.model('Clothes',ItemSchema);


app.use(multer({ dest: ‘./uploads/’,
 rename: function (fieldname, filename) {
   return filename;
 },
}));


app.post(‘/api/photo’,function(req,res){
 var newItem = new Item();
 newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
 newItem.img.contentType = ‘image/png’;
 newItem.save();
});
