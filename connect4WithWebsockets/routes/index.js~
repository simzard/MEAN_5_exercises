var express = require('express');
var router = express.Router();
var siteInfo = require('../siteinfo/siteinfo');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: siteInfo.title,
        info: siteInfo.info,
        authors: siteInfo.authors
    });
});

module.exports = router;