module.exports = function(http_request){

    const __SEARCH_URL = 'http://phimbathu.com/tim-kiem.html?q=';

	const __WATCH_URL = 'http://phimbathu.com/xem-phim/phim-decode-';

    var html;

	var func = {

        searchFilm: function (keyword, callback){

            http_request({

                url: __SEARCH_URL + keyword,

                method: 'get',

                gzip: true,

                headers: {
                    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept-Language':'vi,en-US;q=0.8,en;q=0.6',
                    'Cache-Control':'max-age=0',
                    'Connection':'keep-alive',
                    'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }

            }, function(error, res, body){

                // load thư viện jquery
                var $ = require('cheerio').load(body);

                var taga = $('.list-films ul>li.item a');

                var _opjectOutput = {'id':[],'name':[],'slug':[]};

                taga.each(function(index, item){

                    _opjectOutput.id[index] = item.attribs.href.replace(/^.*-(\d+)\.html$/,"$1").trim();

                    _opjectOutput.slug[index]  = item.attribs.href.replace(/(.*)-\d+\.html$/,"$1").trim();

                    _opjectOutput.name[index] = item.attribs.title.trim();

                });

                return callback(_opjectOutput);

            });

        },


        watchFilm: function (id, callback){

            http_request({

                url: __WATCH_URL + id,

                method: 'get',

                gzip: true,

                headers: {
                    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept-Language':'vi,en-US;q=0.8,en;q=0.6',
                    'Cache-Control':'max-age=0',
                    'Connection':'keep-alive',
                    'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }

            }, function(error, res, body){
                // load thư viện jquery
                var $ = require('cheerio').load(body);
                
                var password = 'phimbathu.com' + '4590481877' + id.toString();

                var video = { 'resulotion' : {}, 'url' : {}, 'title':''}

                function transpose(a) {
                    return a[0].map(function (val, c) {
                        return a.map(function (r) {
                            return r[c];
                        });
                    });
                }

                var regex = /\{"file":"([^"]+?)","type":"mp4","label":"([^"]+?)"/gim;

                // thư viện mã hóa và giải mã link
                var aes = require('gibberish-aes')

                for (var matches = []; result = regex.exec(body); matches.push(result));

                matches = transpose(matches);

                video.title = $('h1').text();

                video.resulotion = matches[2];

                video.url = matches[1].map(function(ele, ind){

                    var link = ele.replace(/\\/g,'');

                    return aes['dec'](link,password);

                });

                callback(video);
            });

        }
    };

    return func;
};
