var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');
var parallel = require('async/parallel');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: '注册界面'});
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

module.exports = router;
