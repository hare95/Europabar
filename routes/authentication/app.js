var User = require('../../models/user.js');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

//Kein doppelter Login
function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/profile');
  }
}

module.exports = function(app, passport) {

  app.get('/login', isNotLoggedIn, function(req, res) {
    var user = req.user;
    res.render(__dirname + '/public/login.ejs', {
      'user': user
    });
  });
  app.post('/login', function(req, res) {
    passport.authenticate('local-login', function(err, user, info) {
      if (!user) {
        return res.json(info);
      } else {
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.json(info);
        });
      }
    })(req, res);
  });

  app.get('/signup', isNotLoggedIn, function(req, res) {
    var user = req.user;
    res.render(__dirname + '/public/signup.ejs', {
      'user': user
    });
  });
  app.post('/signup', function(req, res) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (user) {
        return res.json(info);
      } else {
        return res.json(info);
      }
    })(req, res);
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    var user = req.user;
    res.render(__dirname + '/public/profile.ejs', {
      'user': user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/delete-account', isLoggedIn, function(req, res) {
    var id = req.body.id;
    var user = req.user;

    if (!id) id = user._id;

    User.deleteOne({
      '_id': id
    }, function(err) {
      if (err) console.log(err);

      res.json({
        "success": true 
      });
    });
  });

}
