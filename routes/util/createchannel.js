'use strict';
//import package
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var peer = require('./peer.js')
var orderer = require('./orderer.js')
require('date-utils')

//create new fabric client
var fabric_client = new Fabric_Client();
fabric_client.loadFromConfig(path.join(__dirname, '../artifacts/network.yaml'))

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');

//add peer and orderer to the channel
channel.addOrderer(orderer);
channel.addPeer(peer.org1.peer0.peerObject);
channel.addPeer(peer.org1.peer1.peerObject);
channel.addPeer(peer.org2.peer0.peerObject);
channel.addPeer(peer.org2.peer1.peerObject);
channel.addPeer(peer.org3.peer0.peerObject);
channel.addPeer(peer.org3.peer1.peerObject);

module.exports = channel;


