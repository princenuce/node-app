// import NODEJS library

var __bodyparser = require("body-parser");

var __compression = require('compression');

var __pug = require('pug')

var __fs = require('fs')

var __aes = require('gibberish-aes');

var __request = require('request')

var __app = require('express')()

__app.listen(process.env.PORT || 9090)

__app.use(__compression({'level':9}))


// Routing request
__app.get('/style.css', function(req, res){
    res.sendFile('style.css',{ root : __dirname});
})

__app.get('/process.js', function(req, res){
    res.sendFile('process.js',{ root : __dirname});
})


__app.get('/search/:module/:q?', function(req, res){

    res.removeHeader('X-Powered-By');

    // require Custom module
    var _siteModule = require('./module/' + req.params.module);

    var searchKeywork = req.params.q || false;

    if(searchKeywork){

        callFunction = _siteModule(__request);

        callFunction.searchFilm(searchKeywork,function(callback){

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
__app.get('/watch/:module/:id?/:viewchap?', function(req, res){

    res.removeHeader('X-Powered-By');
    
    var _siteModule = require('./module/' + req.params.module)
    
    var id = req.params.id || false;
    
    var viewchap = req.params.viewchap || false;
    
    if(id){ 
        
        _siteModule(__request).watchFilm(id,function(callback){

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

__app.get('/', function(req, res){

    res.sendFile('index.html' , { root : __dirname});

});
