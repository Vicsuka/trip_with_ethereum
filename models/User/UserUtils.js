var mongoose = require('mongoose');
var User = mongoose.model('User');

var createUser = function (req, res, next) {
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
    User.findByIdAndUpdate(req.user._id, req.body, { new: true }, function (err, user) {
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
    User.findOne({ auth0id: id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getOneUser,
    getByIdUser
};