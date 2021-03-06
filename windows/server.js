﻿var http = require('http');
var fs = require('fs');

var documentRoot = 'C:/gitProjects/mySite/windows/www';

var clientSet = new Set();
var lastCount = 0;

var server= http.createServer(function(req,res){

    var url = req.url; 
    //客户端输入的url，例如如果输入localhost:8888/index.html
    //那么这里的url == /index.html 
	if(url == '/'){
		url = '/index.html';
	}
	
	if(url == '/index.html'){
		var ipAddress;
		var headers = req.headers;
		var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
		forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
		if (!ipAddress) {
		ipAddress = req.connection.remoteAddress;
		}
		ipAddress = '114.255.44.132';
		if(!clientSet.has(ipAddress)){
			if(ipAddress.toString().length > 8) {
				var getUrl = 'http://ip.ws.126.net/ipquery?ip='+ipAddress;
				const reqIp = http.get(getUrl,function(resp){
					var html='';  
					console.log(`STATUS: ${resp.statusCode}`);
					console.log(`HEADERS: ${JSON.stringify(resp.headers)}`);
					//resp.setEncoding('utf8');
					resp.on('data',function(data){
						//var arr=data.toString().split('{');
						//if (arr.length >=2){
						//	var info = arr[1].replace('}','');
						//	html+= info;
						//}
						html += data; 
						
					});  
					resp.on('end',function(){  
						console.log(html)
						eval(html);
						clientSet.add(ipAddress + ':' +localAddress.province + ' ' + localAddress.city); //这里中文是乱码
					});  
				});
				reqIp.on('error', (e) => {
				  console.log(`problem with reqIp request: ${e.message}`);
				});
			}
				
		}
		
		if(lastCount != clientSet.size){
			lastCount = clientSet.size;
			console.log("  " + lastCount)	
		}
	}
	if(url == '/count'){
		//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.write('<p>ip列表:' + clientSet.size + '</p><br>');
			clientSet.forEach(function (item) {
				res.write(item.toString()+ '<br>');
			});
			
            return res.end();
			
	}

    var file = documentRoot + url;

    fs.readFile( file , function(err,data){
        if(err){
            res.writeHeader(404,{
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        }else{
            res.write(data);//将index.html显示在客户端
            res.end();
        }
    });

}).listen(8888);

console.log('服务器开启成功');