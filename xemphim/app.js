// import NODEJS library

var bodyparser = require("body-parser");

var compression = require('compression');

var pug = require('pug')

var fs = require('fs')

var aes = require('gibberish-aes');

var request = require('request')

var app = require('express')()

app.listen(process.env.PORT || 9090)

app.use(compression({'level':9}))


// routing request
app.get('/style.css', function(req, res){
    res.sendFile('style.css',{ root : __dirname});
})
app.get('/process.js', function(req, res){
    res.sendFile('process.js',{ root : __dirname});
})

// tìm kiếm phim
app.get('/search/:module/:q?', function(req, res){
    res.removeHeader('X-Powered-By');
    var pm_module = require('./module/' + req.params.module);
    var search_keywork = req.params.q || false;

    if(search_keywork){
        pm_module(request).searchFilm(search_keywork,function(callback){
            res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
            res.write(JSON.stringify(callback));
            res.end();
        });
    }else{
        res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
        res.write(JSON.stringify({'error' : 'keyword not found'}));
        res.end();
    }

});


// xem phim
app.get('/watch/:module/:id?/:viewchap?', function(req, res){
    res.removeHeader('X-Powered-By');
    var pm_module = require('./module/' + req.params.module)
    var id = req.params.id || false;
    var viewchap = req.params.viewchap || false;
    if(id){
        pm_module(request).watchFilm(id,function(callback){
            res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
            res.write(JSON.stringify(callback));
            res.end();
        },viewchap);
    }else{
        res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
        res.write(JSON.stringify({'error' : 'keyword not found'}));
        res.end();
    }
});

app.get('/', function(req, res){

    res.sendFile('index.html' , { root : __dirname});

});
