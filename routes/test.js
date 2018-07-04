/**
 * Created by duskcloud on 2018/7/3.
 */
var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var parallel = require('async/parallel');
/* GET users listing. */


router.get('/', function (req, res) {
    res.render('test', {title: 'test'});

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

router.get('/register', (req, res) => {
    let username = req.query.username;
    let password = req.query.password;

    parallel([
        function (callback) {
            userModel.findOne({username: username}, (err, doc) => {
                if (doc) {
                    callback(null, "duplicate");
                    res.send("duplicate")
                }
                else {
                    callback(null, "vaild");
                    res.send("vaild")

                }
            })
        },
    ], function (err, res) {
        if (res[0] === "vaild") {
            userModel.create({username: username, password: password, credit: 0}, (err, doc) => {
                if (err) console.log(err);
            })
        }
    });

});
router.post('/uploadImage',(req,res)=>{
    if(req.body.img){
        res.send("success");
    }
    else
    {
        res.send("failed")
    }
});
module.exports = router;
