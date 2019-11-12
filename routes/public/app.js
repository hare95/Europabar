var User = require('../../models/user.js');
var Review = require('../../models/review.js');

//Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //If they aren't redirect them to the home page
        res.redirect('/login');
    }
}

//No login in twice
function isNotLoggedIn(req, res, next) {
    //If user is authenticated in the session, carry on
    if (!req.isAuthenticated()) {
        return next();
    } else {
        //If they aren't redirect them to the home page
        res.redirect('/profile');
    }
}

module.exports = function(app, passport) {

    app.get('/all-users', isLoggedIn, function(req, res) {
        User.find({}, function(err, users) {
            if (err) console.log(err);
            if (users) {
                res.render(__dirname + '/public/all-users.ejs', {
                    'users': users
                });
            }
        });
    });

    app.post('/get-reviews', isLoggedIn, function(req, res) {
        //Get all reviews
        Review.find({}, function(err, reviews) {
            if (err) return callback(err);

            if (reviews) {
                //Send raw data to server
                res.json({"reviews": reviews});
            }
        });
    });

    app.post('/post-review', isLoggedIn, function(req, res) {
        var user = req.user;

        var title = req.body.title;
        var content = req.body.content;

        //Not empty?
        if (title && content) {

            //Create new DB object
            var review = new Review();
            review.user.id = user._id;
            review.user.name = user.data.name;
            review.user.room = user.data.room_number;

            review.post.title = title;
            review.post.content = content;

            review.save(function(err) {
                if (err) console.log(err);

                res.json({"success": true});
            });
        }
    });

    app.post('/post-answer', isLoggedIn, function(req, res) {
        var user = req.user;

        var id = req.body.id;
        var content = req.body.content;

        //Not empty?
        if (id && content) {
            //Find review
            Review.findOne({'_id': id}, function(err, review) {
                if (err) console.log(err);

                if (review) {
                    review.answers.push({
                        user_id: user._id,
                        user_name: user.data.name,
                        user_room: user.data.room_number,
                        content: content
                    });
                    review.save(function(err) {
                        if (err) console.log(err);

                        res.json({"success": true});
                    });
                }
            });
        }
    });

}
