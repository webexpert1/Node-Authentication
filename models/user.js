var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var db = mongoose.connection;

// User Schema
var userSchema = mongoose.Schema({
    name: {type: String},
    username: {type: String, index: true},
    password: {type: String, required: true, bcrypt: true },
    email: {type: String},
    profileimage: {type: String}
});

var User = module.exports = mongoose.model('User', userSchema);
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw callback(err);
        callback(null, isMatch);
    });
};
module.exports.getUserbyUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};
module.exports.getUserbyId = function(id, callback) {
    User.findById(id, callback);
};

module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        if(err) throw err;
        // set hashed pw
        newUser.password = hash;
        // Create User
        newUser.save(callback);
    });
    newUser.save(callback);
};


