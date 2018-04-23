var express = require('express');
var router = express.Router();
var path = require('path');
var NodeCouchDb = require('node-couchdb');

// node-couchdb instance with default options
var couch = new NodeCouchDb();

/*
// node-couchdb instance with Memcached
var MemcacheNode = require('node-couchdb-plugin-memcached');
var couchWithMemcache = new NodeCouchDb({
    cache: new MemcacheNode
});
*/

// node-couchdb instance talking to external service
var couchExternal = new NodeCouchDb({
    host: 'couchdb.external.service',
    protocol: 'https',
    port: 6984
});

// not admin party
var couchAuth = new NodeCouchDb({
    auth: {
        user: 'login',
        pass: 'secret'
    }
});

/* register user Infomation */
router.post('/', function (req, res, next) {
    id = req.body.uniqueInfo

    //ここの処理をブロックチェーンにする

    couch.insert("identity", {
        _id: id,
        field: [
            {
                id:id
            }]
    }).then(({ data, headers, status }) => {
        //ページ遷移処理
    }, err => {
        console.log('this user id is already used')
    })

    couch.get("identity", id).then(({ data, headers, status }) => {
        console.log(data)
        // data is json response
        // headers is an object with all response headers
        // status is statusCode number
    }, err => {
        console.log(err)
        // either request error occured
        // ...or err.code=EDOCMISSING if document is missing
        // ...or err.code=EUNKNOWN if statusCode is unexpected
    });

    /* create database
    couch.createDatabase('identity').then(() => {
        console.log('succeded')
    }, err => {
        console.log(err)
    });
    */

    /* get database list
    couch.listDatabases().then(dbs => {
        console.log(dbs)
    }, err => {
        console.log(err)
    });
    */
    res.render('register', {
        title: 'register finished'
    })
});

module.exports = router;