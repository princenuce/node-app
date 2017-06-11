var request = require('request');

var youtube_bypass = require("./bypass");

var parse_str = function (input) {

    vars = input.split('&');

    output = [];
    
    for (var i = 0; i < vars.length; i++) {
    
        pair = vars[i].split('=');
    
        output[pair[0]] = pair[1];
    
    }
    return output;
}

var youtube = {

    
    bypass_link: function(req, res) {

        var link = bypass; 

        res.json(link);

    },
    
    get_url: function(req, res, callback){

        

        request({

            url: 'https://www.youtube.com/watch?v=' + req.params.id + '&spf=navigate',

            method: 'get'

        }, function(error, response, body){

            var _return = '';

            var data = [];
            data['url'] = [];
            data['s'] = [];
            data['html'] = '';
            var d = '';
            var c = '';

            if(error) {

                _return = error;

            } else {

                json = JSON.parse(body);

                data.jsfile = json[2]['data']['swfcfg']['assets']['js'];

                data.title = json[2]['data']['swfcfg']['args']['title'];

                str = json[2]['data']['swfcfg']['args']['url_encoded_fmt_stream_map'];

                array = str.split(',');

                for(var i = 0; i < array.length; i++){
                    
                    d = parse_str(array[i]);  

                    data.url[i] = d.url;

                    if(typeof d.s !== 'undefined'){
                        
                        youtube_bypass(d.s,function(a){
                        
                            data.s[i] = a;
                        
                        });

                        data.url[i] = decodeURIComponent(data.url[i]).replace(/\/\/[^\.]+\./g,'//redirector.') + '&signature=' + data.s[i];

                    }

                    data['html'] += '<a href="' + data.url[i] + '"> Link ' + i + '</a><br />';

                }

                _return = data;

            }

            callback(_return);

        });

        
    }

};

module.exports = youtube;

