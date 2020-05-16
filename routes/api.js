var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/trip', require('./trip'));

router.get('/myapicall', (req, res) => {
    res.status(200).send('Your api is protected');
});

router.get('/userprofile', (req, res) => {
    const user = req.user;
    console.log('User profile sent: ', user._json.email);
    res.status(200).send(user._json);
});

module.exports = router;
