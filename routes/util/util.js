'use strict';

//import package
var utils = require('fabric-client/lib/utils.js');
var FabricClient = require('fabric-client');
var util = require('util');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var getStorePathForOrg = require('./getStorePathForOrg.js');

//declear basic variable
var logger = utils.getLogger('ir-chain create-channel');
var channel_name = 'mychannel';
var ORGS;
var _commonProto = grpc.load(path.join(__dirname, '../node_modules/fabric-client/lib/protos/common/common.proto')).common;
var _configtxProto = grpc.load(path.join(__dirname, '../node_modules/fabric-client/lib/protos/common/configtx.proto')).common;

//create new client object
var fabric_client = new FabricClient();

//get config file
FabricClient.addConfigFile(path.join(__dirname, '../artifacts/config.json'));
ORGS = FabricClient.getConfigSetting('network-config');

//Acting as a client in org1-3 when creating the channel
var org1 = ORGS.org1.name;
var org2 = ORGS.org2.name;  //not used
var org3 = ORGS.org3.name;  //not used

//creates caroots file
var caRootsPath = ORGS.orderer.tls_cacerts;                     //get cacerts of orderer
let data = fs.readFileSync(path.join(__dirname, caRootsPath));  //read file
let caroots = Buffer.from(data).toString();                     //change to string

//create new orderer object (parameters are (url,obj))
var orderer = fabric_client.newOrderer(
	ORGS.orderer.url,
	{
		'pem': caroots,
		'ssl-target-name-override': ORGS.orderer['server-hostname']
	}
);

//create new peer object (parameters are (url,obj))
var org1_peer0 = fabric_client.newPeer(
    ORGS[org].peer1.requests,
    {
		'pem': caroots,
			'ssl-target-name-override': ORGS[org].peer1['server-hostname'],
			'request-timeout': 120000
    }
)

// set up the client request
let tx_id = fabric_client.newTransactionID();
var request = {
    config: config,
    signatures : signatures,
    name : channel_name,                //ok
    orderer : orderer,                  //ok
    txId  : tx_id                       //ok
};


/*
// can use "channel=<name>" to control the channel name from command line
if (process.argv.length > 2) {
	if (process.argv[2].indexOf('channel=') === 0) {
		channel_name = process.argv[2].split('=')[1];
	}
}
*/


//location of stete_store = location of crypto_store
//first, check the user's exsitence and get the user's infomation
Fabric_Client.newDefaultKeyValueStore({path: getStorePathForOrg.storePathForOrg(org1)
}).then((state_store) => {  //state_store is the instance of a KeyValueStore implementation

    // assign the store to the fabric client that provides eternal object of tcerts,etc..
    fabric_client.setStateStore(state_store);
    
    //get new instance of the CryptoSuite API implementation
    var crypto_suite = Fabric_Client.newCryptoSuite();
    
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: getStorePathForOrg.storePathForOrg(org1)});
    
    crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext('user1', true);
}).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

	// get a transaction id object based on the current user assigned to fabric client
	tx_id = fabric_client.newTransactionID();
	console.log("Assigning transaction_id: ", tx_id._transaction_id);

	// createCar chaincode function - requires 5 args, ex: args: ['CAR12', 'Honda', 'Accord', 'Black', 'Tom'],
	// changeCarOwner chaincode function - requires 2 args , ex: args: ['CAR10', 'Barry'],
	// must send the proposal to endorsing peers
	var request = {
		//targets: let default to the peer assigned to the client
		chaincodeId: 'fabcar',
		fcn: '',
		args: [''],
		chainId: 'mychannel',
		txId: tx_id
	};

	// send the transaction proposal to the peers
	return channel.sendTransactionProposal(request);
});

//
//Attempt to send a request to the orderer with the createChannel method
//
test('\n\n***** SDK Built config update  create flow  *****\n\n', function(t) {
	testUtil.resetDefaults();

	var TWO_ORG_MEMBERS_AND_ADMIN = [{
		role: {
			name: 'member',
			mspId: 'Org1MSP'
		}
	}, {
		role: {
			name: 'member',
			mspId: 'Org2MSP'
		}
	}, {
		role: {
			name: 'admin',
			mspId: 'OrdererMSP'
		}
	}];

	var ONE_OF_TWO_ORG_MEMBER = {
		identities: TWO_ORG_MEMBERS_AND_ADMIN,
		policy: {
			'1-of': [{ 'signed-by': 0 }, { 'signed-by': 1 }]
		}
	};

	var ACCEPT_ALL = {
		identities: [],
		policy: {
			'0-of': []
		}
	};

	var config = null;
	var signatures = [];

	// Acting as a client in org1 when creating the channel
	var org = ORGS.org1.name;

	utils.setConfigSetting('key-value-store', 'fabric-client/lib/impl/FileKeyValueStore.js');

	return Client.newDefaultKeyValueStore({
		path: testUtil.storePathForOrg(org)
	}).then((store) => {
		client.setStateStore(store);
		var cryptoSuite = Client.newCryptoSuite();
		cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({path: testUtil.storePathForOrg(org)}));
		client.setCryptoSuite(cryptoSuite);

		return testUtil.getOrderAdminSubmitter(client, t);
	}).then((admin) =>{
		t.pass('Successfully enrolled user \'admin\' for orderer');

		// use the config update created by the configtx tool
		let envelope_bytes = fs.readFileSync(path.join(__dirname, '../../fixtures/channel/mychannel.tx'));
		config = client.extractChannelConfig(envelope_bytes);
		t.pass('Successfull extracted the config update from the configtx envelope');

		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org1');
	}).then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org1');

		// sign the config
		var signature = client.signChannelConfig(config);
		// convert signature to a storable string
		// fabric-client SDK will convert back during create
		var string_signature = signature.toBuffer().toString('hex');
		t.pass('Successfully signed config update');
		// collect signature from org1 admin
		// TODO: signature counting against policies on the orderer
		// at the moment is being investigated, but it requires this
		// weird double-signature from each org admin
		signatures.push(string_signature);
		signatures.push(string_signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org2');
	}).then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org2');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from org2 admin
		// TODO: signature counting against policies on the orderer
		// at the moment is being investigated, but it requires this
		// weird double-signature from each org admin
		signatures.push(signature);
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getOrderAdminSubmitter(client, t);
	}).then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for orderer');
		the_user = admin;

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from orderer org admin
		// TODO: signature counting against policies on the orderer
		// at the moment is being investigated, but it requires this
		// weird double-signature from each org admin
		signatures.push(signature);
		signatures.push(signature);

		logger.debug('\n***\n done signing \n***\n');

		// build up the create request
		let tx_id = client.newTransactionID();
		var request = {
			config: config,
			signatures : signatures,
			name : channel_name,
			orderer : orderer,
			txId  : tx_id
		};

		// send create request to orderer
		return client.createChannel(request);
	})
	.then((result) => {
		logger.debug('\n***\n completed the create \n***\n');

		logger.debug(' response ::%j',result);
		t.pass('Successfully created the channel.');
		if(result.status && result.status === 'SUCCESS') {
			return e2eUtils.sleep(5000);
		} else {
			t.fail('Failed to create the channel. ');
			t.end();
		}
	}, (err) => {
		t.fail('Failed to create the channel: ' + err.stack ? err.stack : err);
		t.end();
	})
	.then((nothing) => {
		t.pass('Successfully waited to make sure new channel was created.');
		t.end();
	}, (err) => {
		t.fail('Failed to sleep due to error: ' + err.stack ? err.stack : err);
		t.end();
	});
});
