var bodyParser = require("body-parser");

// load thư viện nén nội dung gzip
var compression = require('compression');

// load thư viện express
var app = require('express')()

// thư viện template
var pug = require('pug')

// thư viện quản lí file
var fs = require('fs')

var aes = require('gibberish-aes');

// thư viện crawl nội dung
var request = require('request')

// tạo server lắng nghe trên cổng 8080
app.listen(process.env.PORT || 9090)

// sử dụng compress
app.use(compression({'level':9}))

app.get('/style.css', function(req, res){
    res.sendFile('style.css',{ root : __dirname});
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
app.get('/watch/:module/:id?', function(req, res){
    res.removeHeader('X-Powered-By');
    var pm_module = require('./module/' + req.params.module)
    var id = req.params.id || false;
    if(id){
        pm_module(request).watchFilm(id,function(callback){
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

app.get('/', function(req, res){

    res.sendFile('index-dev.html' , { root : __dirname});

});
