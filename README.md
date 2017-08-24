# mySite
本地服务发布到公网

node启动
先修改 server.js 中的 documentRoot 变量的值 
node server.js


ngrok启动
>ngrok http localhost:8888                  # request subdomain name: 'xxx.ngrok.io'    xxx为随机数  如： http://7c03161f.ngrok.io

ngrok http -subdomain=mysite localhost:8888     # request subdomain name: 'bar.ngrok.io'   要注册账号才可以