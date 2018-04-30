'use strict';

//import package
var utils = require('fabric-client/lib/utils.js');
var Fabric_Client = require('fabric-client');
var util = require('util');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var getStorePathForOrg = require('./getStorePathForOrg.js');
var os = require('os');
var peer = require('./peer.js')
var orderer = require('./orderer.js')

//declear basic variable
var ORGS;
var logger = utils.getLogger('ir-chain create-channel');
var _commonProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/common.proto')).common;
var _configtxProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/configtx.proto')).common;

//create new fabric client
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');

//add peer and orderer to the channel
channel.addOrderer(orderer);
channel.addPeer(peer.org1_peer0);
channel.addPeer(peer.org1_peer1);
channel.addPeer(peer.org2_peer0);
channel.addPeer(peer.org2_peer1);
channel.addPeer(peer.org3_peer0);
channel.addPeer(peer.org3_peer1);

console.log(channel.toString())
console.log(channel.getPeers())

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');		//routes/hfc-key-store
var tx_id = null;

//chaincode
var request = {
	targets: targets,
	chaincodePath: params.chaincodePath,
	chaincodeId: params.chaincodeId,
	chaincodeVersion: params.chaincodeVersion,
	chaincodePackage: params.chaincodePackage
};