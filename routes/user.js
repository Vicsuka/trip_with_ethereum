var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Testing API READY');
    var users = ["user1", "user2", "user3"];
    res.json(users);
});

var createUser = function (req, res, next) {
    console.log(req.body);
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(user);
        }
    });
};

var updateUser = function (req, res, next) {
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(user);
        }
    });
};

var deleteUser = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(req.user);
        }
    });
};

var getAllUsers = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(users);
        }
    });
};

var getOneUser = function (req, res) {
    res.status(200).json(req.user);
};

var getByIdUser = function (req, res, next, id) {
    User.findOne({ _id: id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.status(200).user = user;
            next();
        }
    });
};

router.get('/allusers', getAllUsers);
router.post('/createuser', createUser);

router.route('/users/:userId')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);


router.param('userId', getByIdUser);


module.exports = router;
