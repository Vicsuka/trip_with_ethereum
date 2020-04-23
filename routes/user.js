var express = require('express');
var userUtils = require('../models/User/UserUtils');
var router = express.Router();


// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('User API READY');
    var users = ["user1", "user2", "user3"];
    res.json(users);
});

router.get('/allusers', userUtils.getAllUsers);
router.post('/createuser', userUtils.createUser);

router.route('/users/:userId')
  .get(userUtils.getUser)
  .put(userUtils.updateUser)
  .delete(userUtils.deleteUser);

router.get('/getUserProfile', userUtils.getUserProfile);

router.post('/updateUserProfile', userUtils.updateUserProfile);

router.param('userId', userUtils.findUserById);


module.exports = router;
