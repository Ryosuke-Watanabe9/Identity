// import package
var invoke = require('./util/invoke.js')
var express = require('express');
var path = require('path');
var os = require('os')
var router = express.Router();

/* register user Infomation */
router.post('/', function (req, res, next) {
    id = req.body.uniqueInfo

    var request = {
        targets: '',
        chaincodeId: 'mycc',
        fun: 'invoke',
        args:['a','b','50'],
        chainId:'identity',
        tx_id:''
    }

    invoke.invokeFunction('user1', request)

    res.render('register', {
        title: 'register finished'
    })
});

module.exports = router;