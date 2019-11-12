var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    credentials: {
        email: String,
        password: String,
    },
    data: {
        name: String,
        age: Number,
        room_number: String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.credentials.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
