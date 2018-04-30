//import package
var utils = require('fabric-client/lib/utils.js');
var FabricClient = require('fabric-client');
var util = require('util');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');

//declear basic variable
var ORGS;
var logger = utils.getLogger('ir-chain create-channel');
var _commonProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/common.proto')).common;
var _configtxProto = grpc.load(path.join(__dirname, '../../node_modules/fabric-client/lib/protos/common/configtx.proto')).common;

//get config file
FabricClient.addConfigFile(path.join(__dirname, '../artifacts/config.json'));
ORGS = FabricClient.getConfigSetting('network-config');

//create new client object
var fabric_client = new FabricClient();

//creates caroots file
var caRootsPath = {
    org1_peer0 : ORGS.org1.peer0.tls_cacerts,
    org1_peer1 : ORGS.org1.peer1.tls_cacerts,
    org2_peer0 : ORGS.org2.peer0.tls_cacerts,
    org2_peer1 : ORGS.org2.peer1.tls_cacerts,
}


//get cacerts of peer
let data = {
    org1peer0data : fs.readFileSync(path.join(__dirname, caRootsPath.org1_peer0)),  
    org1peer1data : fs.readFileSync(path.join(__dirname, caRootsPath.org1_peer1)),
    org2peer0data : fs.readFileSync(path.join(__dirname, caRootsPath.org2_peer0)),
    org2peer1data : fs.readFileSync(path.join(__dirname, caRootsPath.org2_peer1)),
}

var peer = {

    org1:{
        peer0:{
            peerObject : fabric_client.newPeer(
                ORGS.org1.peer0.requests,
                {
                    'pem': Buffer.from(data.org1peer0data).toString(),
                    'ssl-target-name-override': ORGS.org1.peer0['server-hostname'],
                }
            ),
            ssl : ORGS.org1.peer0['server-hostname'],
            caroots:Buffer.from(data.org1peer0data).toString(),
        },

        peer1:{
            peerObject :fabric_client.newPeer(
                ORGS.org1.peer1.requests,
                {
                    'pem': Buffer.from(data.org1peer1data).toString(),
                    'ssl-target-name-override': ORGS.org1.peer1['server-hostname'],
                }
            ),
            ssl : ORGS.org1.peer1['server-hostname'],
            caroots:Buffer.from(data.org1peer1data).toString(),
        }
    },
   
    org2:{
        peer0:{
            peerObject : fabric_client.newPeer(
                ORGS.org2.peer0.requests,
                {
                    'pem': Buffer.from(data.org2peer0data).toString(),
                    'ssl-target-name-override': ORGS.org2.peer0['server-hostname'],
                }
            ),
            sslOrg2Peer0 : ORGS.org2.peer0['server-hostname'],
            caroots:Buffer.from(data.org2peer0data).toString(),
        },

        peer1:{
            peerObject: fabric_client.newPeer(
                ORGS.org2.peer1.requests,
                {
                    'pem': Buffer.from(data.org2peer1data).toString(),
                    'ssl-target-name-override': ORGS.org2.peer1['server-hostname'],
                }
            ),
            sslOrg2Peer1 : ORGS.org2.peer1['server-hostname'],
            caroots:Buffer.from(data.org2peer1data).toString(),
        }
    },

    org3:{
        peer0:{
            peerObject: fabric_client.newPeer(
                ORGS.org3.peer0.requests,
                {
                    'pem': Buffer.from(data.org3peer0data).toString(),
                    'ssl-target-name-override': ORGS.org3.peer0['server-hostname'],
                }
            ),
            ssl:ORGS.org3.peer0['server-hostname'],
            caroots:Buffer.from(data.org3peer0data).toString(),
        },

        peer1:{
            peerObject: fabric_client.newPeer(
                ORGS.org3.peer1.requests,
                {
                    'pem': Buffer.from(data.org3peer1data).toString(),
                    'ssl-target-name-override': ORGS.org3.peer1['server-hostname'],
                }
            ),
            ssl:ORGS.org3.peer1['server-hostname'],
            caroots:Buffer.from(data.org3peer1data).toString(),
        }
    },
}

//create new peer object (parameters are (url,obj))
/*
var org1_peer0 = fabric_client.newPeer(
    ORGS.org1.peer0.requests,
    {
        'pem': caroots.org1peer0caroots,
        'ssl-target-name-override': ORGS.org1.peer0['server-hostname'],
    }
)

var org1_peer1 = fabric_client.newPeer(
    ORGS.org1.peer1.requests,
    {
        'pem': caroots.org1peer1caroots,
        'ssl-target-name-override': ORGS.org1.peer1['server-hostname'],
    }
)

var org2_peer0 = fabric_client.newPeer(
    ORGS.org2.peer0.requests,
    {
        'pem': caroots.org2peer0caroots,
        'ssl-target-name-override': ORGS.org2.peer0['server-hostname'],
    }
)

var org2_peer1 = fabric_client.newPeer(
    ORGS.org2.peer1.requests,
    {
        'pem': caroots.org2peer1caroots,
        'ssl-target-name-override': ORGS.org2.peer1['server-hostname'],
    }
)

var org3_peer0 = fabric_client.newPeer(
    ORGS.org3.peer0.requests,
    {
        'pem': caroots.org3peer0caroots,
        'ssl-target-name-override': ORGS.org3.peer0['server-hostname'],
    }
)

var org3_peer1 = fabric_client.newPeer(
    ORGS.org3.peer1.requests,
    {
        'pem': caroots.org3peer1caroots,
        'ssl-target-name-override': ORGS.org3.peer1['server-hostname'],
    }
)


var ssls = {
    sslOrg1Peer0 : ORGS.org1.peer0['server-hostname'],
    sslOrg1Peer1 : ORGS.org1.peer1['server-hostname'],
    sslOrg2Peer0 : ORGS.org2.peer0['server-hostname'],
    sslOrg2Peer1 : ORGS.org2.peer1['server-hostname'],
    sslOrg3Peer0 : ORGS.org3.peer0['server-hostname'],
    sslOrg3Peer1 : ORGS.org3.peer1['server-hostname'],
}
*/

module.exports = peer;