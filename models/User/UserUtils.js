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
        if (err) {
            console.log(err);
        } else {
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
            console.log(err);
        } else {
            return true;
        }
    });
};

var getUserProfile = function (req, res) {
    User.findOne({ auth0id: req.user.id }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(user);
        }
    });
};

var updateUserProfile = function (req, res) {
    let objId;
    User.findOne({ auth0id: req.body.auth0id }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            objId = user._id;

            User.findByIdAndUpdate(objId, req.body, { new: true }, function (err, usr) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(usr);
                }
            });
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