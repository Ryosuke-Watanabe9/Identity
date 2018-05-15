var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.session.userID){
        res.redirect('/register')
    }
    res.render('index',{
        title:'Identity'
    })
});

module.exports = router;