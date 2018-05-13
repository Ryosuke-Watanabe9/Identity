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


/* change user Infomation */
router.post('/', function (req, res, next) {
    var userInfo = JSON.stringify(req.body).replace(/"/g,'\\"')
    /*
    var flgList = []
    for(i=0; i<req.query.userInfo.length; i++){
        if(req.query.userInfo[i] == "" || req.query.userInfo[i] == null){
            flgList.push(false)
        }else{
            flgList.push(true)
        }
    }
    */

    console.log("\""+userInfo+"\"")
    var request = {
        targets: '',
        chaincodeId: 'operateUserInfo',
        fcn: 'changeUserInfo',
        args: [req.session.userID, "\""+userInfo+"\""],
        chainId: 'identity',
        tx_id: ''
    }

    invoke.invokeFunction('user1', request)

    res.render('addFinished', {
        title: 'add finished',
        userID: req.session.userID,
    })

    // we have to change query and table difinition
    //var serviceQuery = 'SELECT name from SERVICE_LIST WHERE id IN (SELECT id from SERVICE_USES_LIST WHERE email=? and accountname=? and firstname=? and lastname=false and phone=false and postalcode=false and address=false);'

    // connect to mysql
    /*
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 's7_fsx..',
        database: 'Identity'
    })

    connection.connect()
    connection.query({
        sql: serviceQuery,
        timeout: 40000,     // 40s
        values: flgList
    }, function (error, rows, fields) {
        if (error) {
            console.log(error)
        } else {
            for (i = 0; i < rows.length; i++) {
                serviceList.push(rows[i].name)
                console.log(rows[i].name)
            }
        }
        connection.end()
        req.session.userID = req.body.userID
        res.render('addFinished', {
            title: 'add finished',
            userID: req.session.userID,
            serviceList: serviceList
        })
    })
    */
})

module.exports = router