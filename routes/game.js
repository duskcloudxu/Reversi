var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('game', { title: '对局'});
});

module.exports = router;
