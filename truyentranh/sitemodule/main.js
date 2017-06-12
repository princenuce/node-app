module.exports = http_request => {

	let func = {
		thichtruyentranh: () => {
			return func.getDataFromHtml()
		},
		getDataFromHtml: () => {
			return func.getHtmlFromPage()
			.then(
				$ => {
					let tagimg  = $('img'),
					    data = {
								    link : [],
								    name : [],
								    thumb : []
								};

						$('a.atext').map((index, element) => {
							data.link[index]= element.attribs.href
							data.name[index]= element.attribs.title
							data.thumb[index]= tagimg[index].attribs.src
						});
					return data;
				}
			);
		},
		getHtmlFromPage: (inputPage, callBack) => {

			let page = inputPage || 1,
				options = {
					uri: 'http://thichtruyentranh.com/ajax/home_hot_list/1/page/' + page,
					method: 'get',
	                gzip: true,
	                headers: {
	                    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	                    'Accept-Encoding':'gzip, deflate, sdch',
	                    'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
	                },
	                transform: (body) => require('cheerio').load(body)
				}
			return http_request(options);
		}
	}

	return func;
}