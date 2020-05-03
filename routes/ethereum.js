var express = require('express');
var router = express.Router();

// Require the web3 node module.
var Web3 = require('web3');

// Show Web3 where it needs to look for a connection to Ethereum.
web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_MAIN_URL_HTTPS));


// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Etereum API READY');
    
});

router.get('/getbalance',(req,res) => {
    // Write to the console the script will run shortly.
    console.log('Getting Ethereum address info.....');

    // Define the address to search witin.
    var addr = (process.env.ETHEREUM_MAIN_ADDRESS);

    // Show the address in the console.
    console.log('Address:', addr);

    // Use Wb3 to get the balance of the address, convert it and then show it in the console.
    web3.eth.getBalance(addr, function (error, result) {
        if (!error)
            res.status(200).send(web3.utils.fromWei(result, 'ether')); // Show the ether balance after converting it from Wei
        else
            console.log('Huston we have a problem: ', error); // Should dump errors here
    });
});




module.exports = router;

