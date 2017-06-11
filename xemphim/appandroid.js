// load thư viện express
var app = require('express')()

// load thư viện nén nội dung gzip
var compression = require('compression');

// thư viện crawl nội dung
var request = require('request')

// tạo server lắng nghe trên cổng 8080
app.listen(process.env.PORT || 8080)

// sử dụng compress
app.use(compression({'level':9}))

app.get('/', function(req,res){
	res.writeHead(200);
	res.write(JSON.stringify({'user':'Vuong', 'name' : 'nguyen'}));
	res.end();
})
