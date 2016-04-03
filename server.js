// server.js
var Menu = require('./app/models/menu');
var Order = require('./app/models/orders');
var Feed = require('./app/models/feed');
var User = require('./app/models/user');
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
    if (req.body.food1 != null)
        order.serve.push({
            food: req.body.food1,
            quan: req.body.number1
        });
    if (req.body.food2 != null)
        order.serve.push({
            food: req.body.food2,
            quan: req.body.number2
        });
    if (req.body.food3 != null)
        order.serve.push({
            food: req.body.food3,
            quan: req.body.number3
        });
    if (req.body.food4 != null)
        order.serve.push({
            food: req.body.food4,
            quan: req.body.number4
        });
    if (req.body.food5 != null)
        order.serve.push({
            food: req.body.food5,
            quan: req.body.number5
        });
    if (req.body.food6 != null)
        order.serve.push({
            food: req.body.food6,
            quan: req.body.number6
        });
    if (req.body.food7 != null)
        order.serve.push({
            food: req.body.food7,
            quan: req.body.number8
        });
    if (req.body.food8 != null)
        order.serve.push({
            food: req.body.food8,
            quan: req.body.number8
        });
    if (req.body.food9 != null)
        order.serve.push({
            food: req.body.food9,
            quan: req.body.number9
        });
    if (req.body.food16 != null)
        order.serve.push({
            food: req.body.food10,
            quan: req.body.number10
        });
    if (req.body.food11 != null)
        order.serve.push({
            food: req.body.food11,
            quan: req.body.number11
        });
    if (req.body.food12 != null)
        order.serve.push({
            food: req.body.food12,
            quan: req.body.number12
        });
    if (req.body.food13 != null)
        order.serve.push({
            food: req.body.food13,
            quan: req.body.number13
        });
    if (req.body.food14 != null)
        order.serve.push({
            food: req.body.food14,
            quan: req.body.number14
        });
    if (req.body.food15 != null)
        order.serve.push({
            food: req.body.food15,
            quan: req.body.number15
        });
    if (req.body.food16 != null)
        order.serve.push({
            food: req.body.food16,
            quan: req.body.number16
        });




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
        if (req.body.food1 != null)
            order.serve.push({
                food: req.body.food1,
                quan: req.body.number1
            });
        if (req.body.food2 != null)
            order.serve.push({
                food: req.body.food2,
                quan: req.body.number2
            });
        if (req.body.food3 != null)
            order.serve.push({
                food: req.body.food3,
                quan: req.body.number3
            });
        if (req.body.food4 != null)
            order.serve.push({
                food: req.body.food4,
                quan: req.body.number4
            });
        if (req.body.food5 != null)
            order.serve.push({
                food: req.body.food5,
                quan: req.body.number5
            });
        if (req.body.food6 != null)
            order.serve.push({
                food: req.body.food6,
                quan: req.body.number6
            });
        if (req.body.food7 != null)
            order.serve.push({
                food: req.body.food7,
                quan: req.body.number8
            });
        if (req.body.food8 != null)
            order.serve.push({
                food: req.body.food8,
                quan: req.body.number8
            });
        if (req.body.food9 != null)
            order.serve.push({
                food: req.body.food9,
                quan: req.body.number9
            });
        if (req.body.food16 != null)
            order.serve.push({
                food: req.body.food10,
                quan: req.body.number10
            });
        if (req.body.food11 != null)
            order.serve.push({
                food: req.body.food11,
                quan: req.body.number11
            });
        if (req.body.food12 != null)
            order.serve.push({
                food: req.body.food12,
                quan: req.body.number12
            });
        if (req.body.food13 != null)
            order.serve.push({
                food: req.body.food13,
                quan: req.body.number13
            });
        if (req.body.food14 != null)
            order.serve.push({
                food: req.body.food14,
                quan: req.body.number14
            });
        if (req.body.food15 != null)
            order.serve.push({
                food: req.body.food15,
                quan: req.body.number15
            });
        if (req.body.food16 != null)
            order.serve.push({
                food: req.body.food16,
                quan: req.body.number16
            });



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




app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);
