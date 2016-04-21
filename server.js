// server.js
var Menu = require('./app/models/menu');
var Order = require('./app/models/orders');
var Feed = require('./app/models/feed');
var Request = require('./app/models/request');
var Bill = require('./app/models/bill');
var User = require('./app/models/user');
var Report = require('./app/models/report');
var fs = require('fs');
// BASE SETUP
// =============================================================================
var mongoose = require('mongoose');
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/menutest1';
mongoose.connect(uri);
var conn = mongoose.connection;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
// configure app
app.use(morgan('dev')); // log reques
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());







var port = process.env.PORT || 8080;
//mongoose.connect(config.database);
app.set('superSecret', config.secret)

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'api!!!yippie!!'
    });
});


var appRoot = process.env.PWD;

app.get('/setup', function(req, res) {

    // create a sample user
    var nick = new User({
        username: 'arjun',
        password: 'password',
        type: 'cus'
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
            success: true
        });
    });
});




router.route('/login')


.post(function(req, res) {

    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.type = req.body.type;




    user.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'sss'
        });
    });

}).get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
});


router.route('/upload')
    .post(function(req, res) {
        console.log(req.files.image.originalFilename);
        console.log(req.files.image.path);
        fs.readFile(req.files.image.path, function(err, data) {
            var dirname = appRoot;
            var newPath = dirname + "/uploads/" + req.files.image.originalFilename;
            fs.writeFile(newPath, data, function(err) {
                if (err) {
                    res.json({
                        'response': "Error"
                    });
                } else {
                    res.json({
                        'response': "Saved"
                    });
                }
            });
        });
    });




router.route('/uploads/:file')

.get(function(req, res) {
    file = req.params.file;
    var dirname = appRoot;
    var img = fs.readFileSync(dirname + "/uploads/" + file);
    res.writeHead(200, {
        'Content-Type': 'image/jpg'
    });
    res.end(img, 'binary');

});




router.route('/users/:user_id')


.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
})


.put(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {

        if (err)
            res.send(err);


        user.username = req.body.username;
        user.password = req.body.password;
        user.type = req.body.type;



        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'User updated!'
            });
        });

    });
})


.delete(function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});




router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        console.log(user);
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 144000 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});




router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});




router.route('/menu')


.post(function(req, res) {

    var menu = new Menu();
    menu.name = req.body.name;
    menu.cost = req.body.cost;
    menu.veg = req.body.veg;
    menu.type = req.body.type;
    menu.category = req.body.category;
    menu.pic = req.body.pic;
    menu.enable = req.body.enable;
    menu.description = req.body.description;
    menu.offerEnable = req.body.offerEnable;
    menu.offerDiscount = req.body.offerDiscount;



    menu.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'sss'
        });
    });

}).get(function(req, res) {
    Menu.find(function(err, menus) {
        if (err)
            res.send(err);

        res.json(menus);
    });
});
















router.route('/order')


.post(function(req, res) {

    var order = new Order();
    order.table = req.body.table;
order.username = req.body.username;

 order.cost = req.body.cost;

serve=[];
for (var i in req.body.serve) {
  var ser = req.body.serve[i];
console.log(ser);
  var serveObj = { food: ser['food'], quan: ser['number'], status: ser['status'] };
 order.serve.push(serveObj);
}




    order.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'order succeess'
        });
    });

}).get(function(req, res) {
    Order.find(function(err, orders) {
        if (err)
            res.send(err);

        res.json(orders);
    });
});









router.route('/bill')


.post(function(req, res) {

 var bill = new Bill();
 bill.username = req.body.username;
    bill.table = req.body.table;

 bill.cost = req.body.cost;
serve=[];
for (var i in req.body.serve) {
  var ser = req.body.serve[i];
console.log(ser);
  var serveObj = { food: ser['food'], quan: ser['number'] };

 bill.serve.push(serveObj);
}




    bill.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'order succeess'
        });
    });

}).get(function(req, res) {
    Bill.find(function(err, orders) {
        if (err)
            res.send(err);

        res.json(orders);
    });
});







router.route('/bill/:bill_id')


.get(function(req, res) {
    Bill.findById(req.params.bill_id, function(err, bill) {
        if (err)
            res.send(err);
        res.json(order);
    });
})


.put(function(req, res) {
    Order.findById(req.params.bill_id, function(err, bill) {

        if (err)
            res.send(err);

        // create a new instance of the order model
        bill.table = req.body.table;
bill.username=req.body.username;
bill.cost = req.body.cost;


//for(var i = 0;i<order.serve.length;i++)
  bill.serve.splice(0, 0);
console.log(bill.serve);
bill.serve=[];
serve=[];
for (var i in req.body.serve) {

   ser = req.body.serve[i];
console.log(ser);
//order.serve[i].remove();
   serveObj = { food: ser['food'], quan: ser['number'] };
 bill.serve.push(serveObj);
}




        bill.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Order updated!'
            });
        });

    });
})


.delete(function(req, res) {
    Bill.remove({
        _id: req.params.bill_id
    }, function(err, order) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});
















router.route('/feed')


.post(function(req, res) {

    var feed = new Feed();
    feed.rating = req.body.rating;
    feed.comment = req.body.comment;




    feed.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'feedback success'
        });
    });

}).get(function(req, res) {
    Feed.find(function(err, feeds) {
        if (err)
            res.send(err);

        res.json(feeds);
    });
});




router.route('/request')


.post(function(req, res) {

    var request = new Request();
    request.type = req.body.type;
request.table = req.body.table;
request.username = req.body.username;
    request.comment = req.body.comment;




    request.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'feedback success'
        });
    });

}).get(function(req, res) {
    Request.find(function(err, requests) {
        if (err)
            res.send(err);

        res.json(requests);
    });
});




router.route('/report')


.post(function(req, res) {

    var report = new Report();
    report.date = req.body.date;
    report.sales = req.body.sales;




    report.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'feedback success'
        });
    });

}).get(function(req, res) {
    Report.find(function(err, reports) {
        if (err)
            res.send(err);

        res.json(reports);
    });
});



router.route('/report/:report_id')


.get(function(req, res) {
    Report.findById(req.params.report_id, function(err,report) {
        if (err)
            res.send(err);
        res.json(report);
    });
})


.put(function(req, res) {
    Report.findById(req.params.report_id, function(err, report) {

        if (err)
            res.send(err);

     report.date = req.body.date;
    report.sales = parseInt(report.sales)+parseInt(req.body.sales);



        report.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Report updated!'
            });
        });

    });
})


.delete(function(req, res) {
    Report.remove({
        _id: req.params.report_id
    }, function(err,report) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});























router.route('/menus/:menu_id')


.get(function(req, res) {
    Menu.findById(req.params.menu_id, function(err, menu) {
        if (err)
            res.send(err);
        res.json(menu);
    });
})


.put(function(req, res) {
    Menu.findById(req.params.menu_id, function(err, menu) {

        if (err)
            res.send(err);

        menu.name = req.body.name;
        menu.cost = req.body.cost;
        menu.veg = req.body.veg;
        menu.type = req.body.type;
        menu.category = req.body.category;
        menu.pic = req.body.pic;
        menu.enable = req.body.enable;
        menu.offerEnable = req.body.offerEnable;
menu.offerDiscount = req.body.offerDiscount;
        menu.description = req.body.description;


        menu.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Menu updated!'
            });
        });

    });
})


.delete(function(req, res) {
    Menu.remove({
        _id: req.params.menu_id
    }, function(err, menu) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});





router.route('/iosmenus/:menu_id')
  .post(function(req,res)
{
var newName = req.body.name
        newCost = req.body.cost
        ,newVeg = req.body.veg
        ,newType = req.body.type
        ,newCategory = req.body.category
        ,newPic = req.body.pic
        ,newEnable = req.body.enable
       ,newOfferEnable = req.body.offerEnable
          ,newOfferDiscount = req.body.offerDiscount
        ,newDescription = req.body.description;

     Menu.findByIdAndUpdate({
       _id : req.params.menu_id
     },{
  name : newName,
         cost : newCost,
         veg :  newVeg ,
         type : newType ,
          category:newCategory,
        pic:newPic,
        enable:newEnable,
      offerEnable: newOfferEnable,
         offerDiscount: newOfferDiscount,
        description: newDescription
     

     },{new : true},function(err,updatedUser) {
       res.json(updatedUser);
     });
   });













router.route('/order/:order_id')


.get(function(req, res) {
    Order.findById(req.params.order_id, function(err, order) {
        if (err)
            res.send(err);
        res.json(order);
    });
})


.put(function(req, res) {
    Order.findById(req.params.order_id, function(err, order) {

        if (err)
            res.send(err);

        // create a new instance of the order model
        order.table = req.body.table;
order.cost = req.body.cost;


//for(var i = 0;i<order.serve.length;i++)
  order.serve.splice(0, 0);
console.log(order.serve);
order.serve=[];
serve=[];
for (var i in req.body.serve) {

   ser = req.body.serve[i];
console.log(ser);
//order.serve[i].remove();
   serveObj = { food: ser['food'], quan: ser['number'] };
 order.serve.push(serveObj);
}




        order.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Order updated!'
            });
        });

    });
})


.delete(function(req, res) {
    Order.remove({
        _id: req.params.order_id
    }, function(err, order) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});




router.route('/serve/:order_id/:serve_id')


.get(function(req, res) {var k;
    Order.findOne({_id : req.params.order_id}, function(err, order) {
        if (err)
            res.send(err);

for(var i = 0;i<order.serve.length;i++)
if(order.serve[i]._id==req.params.serve_id)
   k =i;
       res.json(order.serve[k]);

    });
}).put(function(req, res) {
    Order.findOne({_id : req.params.order_id},function(err, order) {

        if (err)
            res.send(err);

 for(var i = 0;i<order.serve.length;i++)
if(order.serve[i]._id==req.params.serve_id){      
order.serve[i].food = req.body.food;
order.serve[i].quan = req.body.number;
order.serve[i].status = req.body.status;
}

        order.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Order updated!'
            });
        });

    });
}).delete(function(req, res) {


Order.findOne({_id : req.params.order_id},function(err, order) {

        if (err)
            res.send(err);

 for(var i = 0;i<order.serve.length;i++)
if(order.serve[i]._id==req.params.serve_id){      
order.serve[i].remove();
}
 order.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Order updated!'
            });
        }); 
    });

});





router.route('/addorder/:order_id/')


.post(function(req, res) {
Order.findById(req.params.order_id, function(err, order) {
        if (err)
            res.send(err);

serve=[];
for (var i in req.body.serve) {
  var ser = req.body.serve[i];
console.log(ser);
  var serveObj = { food: ser['food'], quan: ser['number'], status: ser['status'] };
 order.serve.push(serveObj);
}

/*
order.serve.push({
            food: req.body.food,
            quan: req.body.number,
status: req.body.status

        });
*/
order.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'sss'
        });
    });

});


});






app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);
