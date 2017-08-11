var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var bcrypt = require("bcrypt-nodejs");
var cookieParser = require('cookie-parser');
var session = require('express-session');

var googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
};

module.exports = function (app, model) {
    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.post('/api/user', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

    // Passport config
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.post('/api/logout', logout);
    app.post('/api/register', regitser);
    app.get('/api/loggedin', loggedin);

    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/assignment/#!/profile',
            failureRedirect: '/assignment/#!/login'
        }));

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }, function (error) {
                done(error, false);
            });
    }

    function regitser(req, res) {
        var user = req.body;

        model
            .userModel
            .createUser(user)
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function (error) {
                    console.log("server error");
                    return res.status(400).send(error);
                });
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            websites: [],
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function login(req, res) {
        return res.json(req.user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    /*API implementation*/
    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if (username && password) {
            findUserByCredentials(username, password);
        } else if (username) {
            findUserByUsername(username);
        }

        function findUserByCredentials(username, password) {
            model
                .userModel
                .findUserByCredentials(username, password)
                .then(function (user) {
                    res.send(user);
                });
        }

        function findUserByUsername(username) {
            model
                .userModel
                .findUserByUsername(username)
                .then(function (user) {
                    if (user == undefined || user == null) {
                        res.status(404).send("not found!");
                    }
                    res.send(user);
                });
        }
    }

    function findUserById(req, res) {
        var uid = req.params.uid;

        model
            .userModel
            .findUserById(uid)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.status(404).send("not found!");
                }
            });
    }

    function updateUser(req, res) {
        var uid = req.params.uid;
        var new_user = req.body;

        model
            .userModel
            .updateUser(uid, new_user)
            .then(
                function (user) {
                    res.json(user)
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var uid = req.params.uid;
        if (uid) {
            model
                .userModel
                .deleteUser(uid)
                .then(
                    function () {
                        logout(req, res);
                        res.sendStatus(200);
                    },
                    function (error) {
                        res.sendStatus(400).send(error);
                    }
                );
        } else {
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }
    }
};