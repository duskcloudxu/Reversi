/**
 * Created by duskcloud on 2018/7/3.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('test', { title: 'test'});
});

module.exports = router;
