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
            res.status(200).send(user);
        }
    });
};

var deleteUser = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(req.user);
        }
    });
};

var getAllUsers = function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(users);
        }
    });
};

var getUser = function (req, res) {
    res.status(200).json(req.user);
};

var findUserById = function (req, res, next, id) {
    User.findOne({ auth0id: id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

var userExists = function (id, userData) {
    User.findOne({ auth0id: id }, function (err, user) {
        if (!err) {
            if (!user) {
                newUser(userData);
                console.log("New user created!");
            } else {
                console.log("User exists");
            }
        }
    });
};

var newUser = function (userData) {
    var user = new User(userData);

    user.save(function (err) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
};

var getUserProfile = function (req, res, next) {
    User.findOne({ auth0id: req.user.id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(user);
        }
    });
};

var updateUserProfile = function (req, res, next) {
    User.findOneAndUpdate({ auth0id: req.body.auth0id }, req.body, { new: true }, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(user);
        }
    });
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser,
    findUserById,
    userExists,
    newUser,
    getUserProfile,
    updateUserProfile
};