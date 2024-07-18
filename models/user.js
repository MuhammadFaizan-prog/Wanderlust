const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//? It adds username and pass and their hash and salt automatically
//? into schema with some methods

const userSchema = new Schema({
email:{
    type:String,
    required:true,
},

});

userSchema.plugin(passportLocalMongoose);
//? Using it as plugin bec it auto creates user/pass  for userschema


module.exports = mongoose.model('User', userSchema);