// import package
var invoke = require('./util/invoke.js')
var express = require('express');
var path = require('path');
var os = require('os')
var router = express.Router();

/* register user Infomation */
router.post('/', function (req, res, next) {
    var request = {
        targets: '',
        chaincodeId: 'operateUserInfo',
        fcn: 'createUser',
        args:[req.body.userID,''],
        chainId:'identity',
        tx_id:''
    }

    invoke.invokeFunction('user1', request)
  
    //if invoke has finished, create login session
    req.session.userID=req.body.userID
    console.log(req.session.userID)
    res.render('register', {
        title: 'register finished',
        userID:req.session.userID
    })
});

module.exports = router;