// import package
var express = require('express')
var path = require('path')
var os = require('os')
var mysql = require('mysql')
var Fabric_Client = require('fabric-client')
var invoke = require('./util/invoke.js')
var peer = require('./util/peer.js')
var orderer = require('./util/orderer.js')
var router = express.Router();


/* register user Infomation */
router.post('/', function (req, res, next) {
    var serviceList = []
    var request = {
        targets: '',
        chaincodeId: 'operateUserInfo',
        fcn: 'createUser',
        args: [req.body.userID, ''],
        chainId: 'identity',
        tx_id: ''
    }

    invoke.invokeFunction('user1', request)

    // we have to change query and table difinition
    var serviceQuery = 'SELECT name from SERVICE_LIST WHERE id IN (SELECT id from SERVICE_USES_LIST WHERE email=true and accountname=false and firstname=false and lastname=false and phone=false and postalcode=false and address=false);'

    // connect to mysql
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 's7_fsx..',
        database: 'Identity'
    })

    connection.connect()
    connection.query(serviceQuery, function (error, rows, fields) {
        if (error) {
            console.log(error)
        } else {
            for (i = 0; i < rows.length; i++) {
                serviceList.push(rows[i].name)
                console.log(rows[i].name)
            }
        }

        console.log(serviceList)
        connection.end()

        //if invoke has finished, create login session
        req.session.userID = req.body.userID
        res.render('register', {
            title: 'register finished',
            userID: req.session.userID,
            serviceList: serviceList
        })
    })
});

module.exports = router;