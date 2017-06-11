
module.exports = function(http_request){
    
    //scope module
    
    //requets closure
	
	var func = {

        getHtmlFromUrl : function (url){
    		
            http_request({

                url: 'http://google.com/',

                method: 'get'

            }, function(error, res, body){
            	
            	console.log(res);

            });
	    }
    }
	
    return func;
};