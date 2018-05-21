var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('demo2',{
        title:'Demo Page2',
        userID:req.session.userID
    })
});

module.exports = router;