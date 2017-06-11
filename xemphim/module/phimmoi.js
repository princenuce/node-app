module.exports = function(http_request){

    const __SEARCH_URL = 'http://phimmoi.net/tim-kiem/';

	const __WATCH_URL = 'http://www.phimmoi.net/phim/tu-my-nhan-';

    var html;

	var func = {

        searchFilm: function (keyword, callback){

            http_request({

                url: __SEARCH_URL + keyword + '/',

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

                var href = $('ul.list-movie>li.movie-item>a');

                var _opjectOutput = {'id':[],'name':[],'slug':[]};

                $('ul.list-movie>li.movie-item span.movie-title-1').each(function(index, item){

                    _opjectOutput.id[index] = href[index].attribs.href.replace(/^phim\/.*-(\d+)\/$/,"$1");

                    _opjectOutput.slug[index]  = href[index].attribs.href.replace(/^phim\/(.*)-\d+\/$/,"$1");

                    _opjectOutput.name[index] = $(this).text();

                });

                return callback(_opjectOutput);

            });

        },


        watchFilm: function (id, callback, url = false){
            link = url === false ? __WATCH_URL + id + '/xem-phim.html' : 'http://www.phimmoi.net/phim/' + id.replace('~','/') + '.html';
        
            http_request({
                url: link,
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
                // get titile
                var matches = body.match(/filmInfo\.title='([^']+?)'/i);
                var title = matches[1];

                // get ID and set key unlock link
                var matches = body.match(/currentEpisode\.requestId=\'(\d+)\';/);
                var password = 'PhimMoi.Net@' + matches[1];

                // get link source viddeo
                var matches = body.match(/http:\/\/episode[^"]+/);
                var sourceVideo = matches[0];

                // load thư viện jquery
                var $ = require('cheerio').load(body);

                // get all server link with ID, Title Link, Title SERVER
                var chapterInfo = [];
                $('div.server').map(function(i, e){
                    chapterInfo[i] = [];
                    $(this).children('ul').children('li').children('a').map(function(){
                        opj = {};
                        opj[$(this).attr('href').replace(/phim\/([^/]+)-(\d+)\/([^/]+)-(\d+)\.html$/,'$1-$2~$3-$4')] = $(this).attr('title');
                        chapterInfo[i].push(opj);
                    });
                    opj = {}
                    opj['servername'] = $(this).children('.server-name').text()
                    chapterInfo[i].push(opj);
                })
                //console.log(chapterInfo);
                http_request({
                    url: sourceVideo,
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

                    if(!body) return;

                    var video = { 'chapter' : chapterInfo, 'resulotion' : {}, 'url' : {}, 'title' : ''}

                    function transpose(a) {
                        return a[0].map(function (val, c) {
                            return a.map(function (r) {
                                return r[c];
                            });
                        });
                    }

                    video.title = title;

                    var regex = /"height":(\d+),"url":"([^"]+?)"/gim;

                    for (var matches = []; result = regex.exec(body); matches.push(result));

                    matches = transpose(matches);

                    video.resulotion = matches[1];

                    // thư viện mã hóa và giải mã link
                    var aes = require('gibberish-aes')

                    video.url = matches[2].map(function(ele, ind){

                        var link = ele.replace(/\\/g,'');

                        return aes['dec'](link,password);

                    });

                    callback(video);
                });
            });

        }
    }

    return func;
};
