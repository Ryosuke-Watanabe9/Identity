// import package
var express = require('express')
var path = require('path')
var os = require('os')
var mysql = require('mysql')
var Fabric_Client = require('fabric-client')
var invoke = require('./util/invoke.js')
var peer = require('./util/peer.js')
var orderer = require('./util/orderer.js')
var router = express.Router()

// get user Info and 
router.get('/', function (req, res, next) {

    //create new fabric client
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

    //
    var member_user = null
    var store_path = path.join(__dirname, './hfc-key-store')
    var tx_id = null

    Fabric_Client.newDefaultKeyValueStore({
        path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store)
        var crypto_suite = Fabric_Client.newCryptoSuite()
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path })
        crypto_suite.setCryptoKeyStore(crypto_store)
        fabric_client.setCryptoSuite(crypto_suite)

        // get the enrolled user from persistence, this user will sign all requests
        return fabric_client.getUserContext('user1', true)
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence')
            member_user = user_from_store
        } else {
            throw new Error('Failed to get user1 ... run registerUser.js')
        }
        var request = {
            targets: peer.org1.peer0.peerObject,
            chaincodeId: 'operateUserInfo',
            fcn: 'queryUserInfo',
            args: [req.session.userID]
        }
        // send the query proposal to the peer
        return channel.queryByChaincode(request)
    }).then((query_responses) => {
        console.log("Query has completed, checking results")
        // query_responses could have more than one  results if there multiple peers were used as targets
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0])
            } else {
                console.log(query_responses[0].toString())
                res.render('addUserInfo', {
                    title: '会員情報入力 - Identity -',
                    userInfo: query_responses[0].toString()
                })
            }
        } else {
            console.log("No payloads were returned from query")
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err)
    });
})

router.get('/showCompanyNum', function (req, res, next) {

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
            connection.end()
            res.json(rows)
        }
    })
})

module.exports = router