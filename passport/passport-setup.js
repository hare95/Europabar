var LocalStrategy = require('passport-local').Strategy;

//Load up the user model
var User = require('../models/user.js');

module.exports = function(passport) {

    //Serialize user for cookie transportation
    passport.serializeUser(function(user, callback) {
        callback(null, user.id);
    });

    //Deserialize from string
    passport.deserializeUser(function(id, callback) {
        User.findOne({'_id': id}, function(err, user) {
            callback(err, user);
        });
    });

    //Differ between signup and login
    passport.use('local-signup', new LocalStrategy({
        //Set email as username
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, callback) {
        process.nextTick(function() {
            User.findOne({'credentials.email':  email}, function(err, user) {
                if (err) return callback(err);

                if (user) {
                    return callback(null, null, {
                        'error': 'This email was already registered.',
                        'email': req.body.email
                    });
                } else {
                    var newUser = new User();
                    //Set the user's local credentials
                    newUser.credentials.email = email;
                    newUser.credentials.password = newUser.generateHash(password);

                    newUser.data.name = req.body.name;
                    newUser.data.age = req.body.age;
                    newUser.data.room_number = req.body.room_number;

                    newUser.save(function(err) {
                        if (err) throw err;
                        return callback(null, newUser, {
                            'success': 'Your signup was successful. Please login now to complete your registration.',
                        });
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, callback) { // callback with email and password from our form
        User.findOne({'credentials.email': email}, function(err, user) {
            if (err) return callback(err);

            //Check if user exists
            if (!user) {
                return callback(null, null, {
                    'error': 'This email is not registered.',
                    'email': req.body.email
                });
            }
            //Check if password matches
            if (!user.validPassword(password)) {
                return callback(null, null, {
                    'error': 'The email and password combination did not match.',
                    'email': req.body.email
                });
            }

            //Cookie only exists during the duration of the user-agent
            if (!req.body.remember) {
                req.session.cookie.maxAge = 1 * 60 * 60 * 1000; //Also expires after 1 hour
            } else {
                //Never actually expire
                req.session.cookie.maxAge = 4 * 7 * 24 * 60 * 60 * 1000; //Expires after 4  weeks if user does not login again in that time
            }

            //Allow login
            return callback(null, user, {
                'success': 'Your login was successful.',
            });
        });
    }));
};
