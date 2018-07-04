/**
 * Created by duskcloud on 2018/7/4.
 */
let mongoose=require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost:27017/reversi');

let users = new mongoose.Schema({
    username: String,
    password: String,
    credits: Number,
    avatar:String,
});
let model = mongoose.model('user', users);
module.exports=model;
// module.exports=userSchema;