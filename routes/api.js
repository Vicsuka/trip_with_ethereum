var express = require('express');
var router = express.Router();

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Testing API READY');
    var list = ["item1", "item2", "item3"];
    res.json(list);
});

router.use('/user', require('./user'));
router.use('/trip', require('./trip'));
router.use('/ethereum', require('./ethereum'));

router.get('/myapicall', (req, res) => {
    res.status(200).send('Your api is protected');
});

router.get('/userprofile', (req, res) => {
    const user = req.user;
    console.log('User profile sent: ', user._json.email);
    res.status(200).send(user._json);
});

module.exports = router;
