'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var peer = require('./peer.js')
var orderer = require('./orderer.js')
require('date-utils')

// create new fabric client
var fabric_client = new Fabric_Client();
fabric_client.loadFromConfig(path.join(__dirname, '../artifacts/network.yaml'))

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');

// add peer and orderer to the channel
channel.addOrderer(orderer);
channel.addPeer(peer.org1.peer0.peerObject);
channel.addPeer(peer.org1.peer1.peerObject);
channel.addPeer(peer.org2.peer0.peerObject);
channel.addPeer(peer.org2.peer1.peerObject);
channel.addPeer(peer.org3.peer0.peerObject);
channel.addPeer(peer.org3.peer1.peerObject);

var member_user = null;
var store_path = path.join(__dirname, '../hfc-key-store');
var tx_id = null;
var applicationStatus = null;
var target = peer.org1.peer1.peerObject

module.exports.getApplicationStatus = function getApplicationStatus() {
	console.log('query got at ' + new Date().toFormat("YYYY/MM/DD/HH24/MI/SS"));
	return applicationStatus;
}

module.exports.queryFunction = function queryFunction(user, request) {

	console.log('start query function at ' + new Date().toFormat("YYYY/MM/DD/HH24/MI/SS"))
	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	Fabric_Client.newDefaultKeyValueStore({
		path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({
			path: store_path
		});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
		return fabric_client.getUserContext(user, true);
	}).then((user_from_store) => {
		if (user_from_store && user_from_store.isEnrolled()) {
			console.log('Successfully loaded ' + user + ' from persistence');
			member_user = user_from_store;
		} else {
			throw new Error('Failed to get ' + user + '... run registerUser.js');
		}
		request.targets = peer.org1.peer0.peerObject
		// send the query proposal to the peer
		return channel.queryByChaincode(request);
	}).then((query_responses) => {
		console.log("Query has completed, checking results");
		console.log('get application status at ' + new Date().toFormat("YYYY/MM/DD/HH24/MI/SS"))
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
			} else {
				applicationStatus = query_responses[0].toString()
			}
		} else {
			console.log("No payloads were returned from query");
		}
	}).catch((err) => {
		console.error('Failed to query successfully :: ' + err);
	});

	console.log('return application status at ' + new Date().toFormat("YYYY/MM/DD/HH24/MI/SS"))

	return applicationStatus;
}

module.exports.getQueryInfo = function getQueryInfo(username) {

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	Fabric_Client.newDefaultKeyValueStore({
		path: store_path
	}).then((state_store) => {
		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({
			path: store_path
		});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);

		// get the enrolled user from persistence, this user will sign all requests
		return fabric_client.getUserContext(username, true);
	}).then((member) => {
		console.log('target peer "' + target + '"');
		return channel.queryInfo(target);
	}, (err) => {
		console.log('Failed to get submitter "' + username + '"');
	}).then((queryInfo) => {
		if (queryInfo) {
			console.log('return queryInfo');
			return queryInfo;
		} else {
			console.log('response_payloads is null');
		}
	}).catch((err) => {
		console.log('Failed to query with error:' + err);
	});
};

module.exports.getBlockByNumber = function getBlockByNumber(blockNumber, username) {

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	Fabric_Client.newDefaultKeyValueStore({

		path: store_path

	}).then((state_store) => {

		// assign the store to the fabric client
		fabric_client.setStateStore(state_store);
		var crypto_suite = Fabric_Client.newCryptoSuite();
		// use the same location for the state store (where the users' certificate are kept)
		// and the crypto store (where the users' keys are kept)
		var crypto_store = Fabric_Client.newCryptoKeyStore({
			path: store_path
		});
		crypto_suite.setCryptoKeyStore(crypto_store);
		fabric_client.setCryptoSuite(crypto_suite);
		// get the enrolled user from persistence, this user will sign all requests
		return fabric_client.getUserContext(username, true);

	}).then((member) => {

		let response_payload = channel.queryBlock(parseInt(blockNumber));
		if (response_payload) {
			console.log(response_payload);
			return response_payload;
		} else {
			console.log('response_payload is null');
			return 'response_payload is null';
		}

	}).catch((err) => {

		console.log('Failed to query with error:' + err);

	});
};