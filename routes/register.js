var express = require('express');
var router = express.Router();
var path = require('path');

/* register user Infomation */
router.post('/', function (req, res, next) {
    id = req.body.uniqueInfo

    

    res.render('register', {
        title: 'register finished'
    })
});

module.exports = router;