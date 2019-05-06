var express = require('express');
var opn = require('opn');
var path = require('path');
var myConfig = require('./config.json');
var bodyParser = require('body-parser')
var request = require('superagent');

var ROOT_PATH = path.resolve(process.env.NODE_ENV == "development"?'./':'../'); // 项目根路径

var app = express();
app.engine('html', require('express-art-template'));
app.set('views', ROOT_PATH + '/html');
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(process.env.NODE_ENV == "development"?ROOT_PATH:ROOT_PATH));

// 路由
app.use('/',require('./routes.js'));

app.post(myConfig.audit.nodeUrl, function(req, res) {
    request
        .post(myConfig.audit.apiUrl)
        .query(req.body) 
        .end(function(err, resInfo){
            res.json(resInfo.body)
        });
});
app.post(myConfig.verifyCode.nodeUrl, function(req, res) {
    request
        .post(myConfig.verifyCode.apiUrl)
        .query(req.body) 
        .end(function(err, resInfo){
            res.json(resInfo.body)
        });
});
var port = myConfig.port || process.env.PORT || 8180;

/* 启动服务 */
app.listen(port, 'localhost', function() {
    console.log('成功开启'+ port +'端口');
    var uri = 'http://localhost:' + port;
    process.env.NODE_ENV == "development"?opn(uri):''
});