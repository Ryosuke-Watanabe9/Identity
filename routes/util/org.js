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

//Acting as a client in org1-3 when creating the channel
var org = {
    org1 :{
        name :ORGS.org1.name,
        mspID:ORGS.org1.mspid,
        ca:ORGS.org1.ca
    },
    org2 :{
        name : ORGS.org2.name,
        mspID: ORGS.org2.mspid,
        ca:ORGS.org2.ca
    },
    org3 :{
        name : ORGS.org3.name,
        mspID:ORGS.org2.mspid,
        ca:ORGS.org3.ca
    }
}

module.exports = org;
