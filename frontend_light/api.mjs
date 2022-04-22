import express, { json } from 'express';
var http = require('http');

export class API{
    app = express();
    port = 3000;
    http = require('http');
    
    constructor(){

    }

    options = {
        host: 'localhost',
        port: 3000,
        path: '/some/path',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

    req = http.get(this.options, function(res){
        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);
        })
    });

    basicGet(graphID,authHeader){
        options = {
            host: 'localhost',
            port: 3000,
            path: '/getLogElements',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader,
              'userid' : graphID
            }
          };
    
        req = http.get(this.options, function(res){
            var bodyChunks = [];
            res.on('data', function(chunk) {
                bodyChunks.push(chunk);
            }).on('end', function() {
                var body = Buffer.concat(bodyChunks);

                console.log(JSON.parse(body));
                
            })
        });
    }
}

