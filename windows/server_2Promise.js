﻿var http = require('http');
var fs = require('fs');

var documentRoot = 'C:/gitProjects/mySite/windows/www';

var clientSet = new Set();
var clinetMoreInfoSet = new Set();
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
		clientSet.add(ipAddress);
		if(lastCount != clientSet.size){
			lastCount = clientSet.size;
			console.log("  " + lastCount)	
		}
	}
	if(url == '/count'){
		res.writeHeader(203,{
                'content-type' : 'text/html;charset="utf-8"'
            });
			res.write('<p>ip列表</p>');
			//clinetMoreInfoSet.clear();
			clientSet.forEach(function (item) {
				if(item.toString().length > 8) {
					var getUrl = 'http://ip.ws.126.net/ipquery?ip='+item.toString();
					http.get(getUrl,function(req,res2){  
						var html='';  
						req.on('data',function(data){  
							html+=data;
						});  
						req.on('end',function(){  
							//res.write(item.toString()+ ':' + html + '<br>');
							//console.log(item.toString()+ ':' + html + '<br>');
							clinetMoreInfoSet.add(item.toString()+ ':' + html );
		//					res.write('kkkkk');
						});  
					});
				}
			});
			
			clinetMoreInfoSet.forEach(function (item) {
				//res.write(item.toString() + '<br>');
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