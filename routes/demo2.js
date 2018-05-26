var express = require('express')
var mysql = require('mysql')
var Fabric_Client = require('fabric-client')
var invoke = require('./util/invoke.js')
var peer = require('./util/peer.js')
var orderer = require('./util/orderer.js')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
    var serviceQuery = 'INSERT INTO DEMO_PAGE2 VALUES(0,?,?);'

    console.log('req.session.userID')

    // connect to mysql
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 's7_fsx..',
        database: 'Demo'
    })

    connection.connect()
    connection.query(serviceQuery,[req.session.userID,'09022280685'], function (error, result) {
        if (error) {
            console.log(error)
        } else {
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            var request = {
                targets: '',
                chaincodeId: 'operateUserInfo',
                fcn: 'changeUserPoint',
                args: [req.session.userID, req.query.income],
                chainId: 'identity',
                tx_id: ''
            }
            invoke.invokeFunction('user1', request)
        }
        connection.end()
    })
    res.render('demo2', {
        title: 'Demo Page2',
        userID: req.session.userID
    })
})

module.exports = router