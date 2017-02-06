"use strict";
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser')
var app = new express();
//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '',
//    database: 'usermanage'
//});
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({// to support URL-encoded bodies
    extended: true
}));
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usermanage'
});
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    res.send("Hello buddy");
});
app.get('/user', function (req, res) {


    pool.getConnection(function (error, connection) {
        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error)
                throw error;
            res.json(results);
        });
        console.log('connected as id ' + connection.threadId);
        connection.release();
        // Handle error after the release.
        if (error)
            throw error;
        // Don't use the connection here, it has been returned to the pool.

    });
});
app.post('/api', function (req, res) {
    var rq = req.body.rq;
//    console.log(req);
    console.log(rq);




    if (rq === "update") {
        var name = req.body.name;
        var id = req.body.id;
        pool.getConnection(function (error, connection) {
            connection.query('UPDATE `users` SET `name`= ? WHERE id= ?', [name, id], function (error, results, fields) {
                if (error)
                    throw error;

            });
            console.log('connected as id ' + connection.threadId);
            connection.release();
            // Handle error after the release.
            if (error)
                throw error;
            // Don't use the connection here, it has been returned to the pool.
            res.json([{flag: 'true'}]);
        });
    }

    if (rq === "create") {
        var name = req.body.name;
//     
        pool.getConnection(function (error, connection) {
            connection.query('INSERT INTO users (`name`) VALUES (?)', [name], function (error, results, fields) {
                if (error)
                    throw error;

            });
            console.log('connected as id ' + connection.threadId);
            connection.release();
            // Handle error after the release.
            if (error)
                throw error;
            // Don't use the connection here, it has been returned to the pool.
            res.json([{flag: 'true'}]);
        });
    }

    if (rq === "del") {
        var id = req.body.id;
//     
        pool.getConnection(function (error, connection) {
            connection.query('DELETE FROM  `users` WHERE id=?', [id], function (error, results, fields) {
                if (error)
                    throw error;

            });
            console.log('connected as id ' + connection.threadId);
            connection.release();
            // Handle error after the release.
            if (error)
                throw error;
            // Don't use the connection here, it has been returned to the pool.
            res.json([{flag: 'true'}]);
        });
    }



});

function update(req, res) {
    var name = req.body.name;
    var id = req.body.id;
    pool.getConnection(function (error, connection) {
        connection.query('UPDATE `users` SET `name`= ? WHERE id= ?', [name, id], function (error, results, fields) {
            if (error)
                throw error;

        });
        console.log('connected as id ' + connection.threadId);
        connection.release();
        // Handle error after the release.
        if (error)
            throw error;
        // Don't use the connection here, it has been returned to the pool.
        res.json([{flag: 'true'}]);
    });

}
app.listen(8100, function () {
    console.log('example app listenting on port 8100');
});
