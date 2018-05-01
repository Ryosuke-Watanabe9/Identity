// import package
var invoke = require('./util/invoke.js')
var express = require('express');
var Fabric_Client = require('fabric-client')
var path = require('path');
var os = require('os')
var peer = require('./util/peer')
var orderer = require('./util/orderer')
var Fabric_Client = require('fabric-client')
var router = express.Router();

// create new fabric client
var fabric_client = new Fabric_Client()
fabric_client.loadFromConfig(path.join(__dirname, './artifacts/network.yaml'))

// setup the fabric network
var channel = fabric_client.newChannel('identity')

// add peer and orderer to the channel
channel.addOrderer(orderer)
channel.addPeer(peer.org1.peer0.peerObject)
channel.addPeer(peer.org1.peer1.peerObject)
channel.addPeer(peer.org2.peer0.peerObject)
channel.addPeer(peer.org2.peer1.peerObject)

var member_user = null
var store_path = path.join(__dirname, './hfc-key-store')
var tx_id = null

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