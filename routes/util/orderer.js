'use strict';

//import package
var utils = require('fabric-client/lib/utils.js');
var util = require('util');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var FabricClient = require('fabric-client');

//declear basic variable
var ORGS;
var logger = utils.getLogger('ir-chain create-channel');
var _commonProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/common.proto')).common;
var _configtxProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/configtx.proto')).common;

//create new client object
var fabric_client = new FabricClient();

//get config file
FabricClient.addConfigFile(path.join(__dirname, '../artifacts/config.json'));
ORGS = FabricClient.getConfigSetting('network-config');

//get pem(caroots)
var caRootsPath = ORGS.orderer.tls_cacerts;
let data = fs.readFileSync(path.join(__dirname, caRootsPath));
let caroots = Buffer.from(data).toString();

//create new orderer object
let orderer = fabric_client.newOrderer(
	ORGS.orderer.url,
	{
		'pem': caroots,
		'ssl-target-name-override': ORGS.orderer['server-hostname'],
		'request-timeout': 120000
	}
);

module.exports = orderer;
