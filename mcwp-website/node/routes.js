var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    var ua = req.get('User-Agent');
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)){
        res.render('mobile/index.html');        
    } else {
        res.render('index.html');                
        // res.sendFile(process.env.NODE_ENV == "development"?ROOT_PATH + '/html/index.html':ROOT_PATH + '/html/index.html')
    }
});

router.get('/citizenLoan', function (req, res) {
    res.render('citizenLoan.html');
});

router.get('/microLoan', function (req, res) {
    res.render('mortgageLoan.html');
});
// router.get('/helpLoan', function (req, res) {
//     res.render('helpLoan.html');
// });
router.get('/about', function (req, res) {
    res.render('index.html');
});
router.get('/join', function (req, res) {
    res.render('joinus.html');
});

router.get('/mobile', function(req, res) {
    res.render('mobile/index.html');        
});
router.get('/mobile/citizen', function(req, res) {
    res.render('mobile/citizen.html')
});
router.get('/mobile/house', function(req, res) {
    res.render('mobile/house.html')
});
// router.get('/mobile/help', function(req, res) {
//     res.render('mobile/help.html')
// });
router.get('/mobile/about', function(req, res) {
    res.render('mobile/index.html')
});
router.get('/mobile/join', function(req, res) {
    res.render('mobile/joinus.html')
});
router.get('/mobile/call', function(req, res) {
    res.render('mobile/index.html')
});
module.exports = router;