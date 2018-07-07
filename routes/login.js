var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登陆界面'});
});
router.get('/login', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
    userModel.findOne({username: username}, (err, doc) => {
        console.log(doc);
        if(!doc){
            res.send("无此用户")
        }
        else if (doc.password === password) {
            res.send("登陆成功");
        }
        else {
            res.send("密码错误")
        }
    })
});

module.exports = router;
