/**
 * Created by duskcloud on 2018/7/3.
 */
var express = require('express');
var router = express.Router();
var parallel = require('async/parallel');
var io=global.socketio;
/* GET users listing. */


router.get('/', function (req, res) {
    res.render('test', {title: 'test'});

});


router.post('/uploadImage',(req,res)=>{
    console.log(req.body);
    if(req.body.img){
        res.send("success");
    }
    else
    {
        res.send("failed")
    }
});



module.exports = router;
