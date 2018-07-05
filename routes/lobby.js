var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var deskNum=[1,2,3,4];
  res.render('lobby', { title: '对战大厅',deskNum:deskNum});
});

module.exports = router;
