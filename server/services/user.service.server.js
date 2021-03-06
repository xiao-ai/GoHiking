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
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);
    app.get('/api/user/fuzzySearch/:text', fuzzySearch);
    app.put('/api/user/:userId/follow/:followId', followUser);
    app.put('/api/user/:userId/unfollow/:unFollowId', unFollowUser);
    app.get('/api/user/:userId/following', findFollowingForUser);
    app.get('/api/user/:userId/followers', findFollowersForUser);
    app.put('/api/user/:userId/addFavoriteTrail/:trailId', addFavoriteTrail);
    app.put('/api/user/:userId/removeFavoriteTrail/:trailId', removeFavoriteTrail);
    app.get('/api/getAllUsers', getAllUsers);

    // Passport config
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.post('/api/logout', logout);
    app.post('/api/register', register);
    app.get('/api/loggedin', loggedin);
    app.get('/api/checkAdmin', checkAdmin);

    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#!/profile',
            failureRedirect: '/#!/login'
        }));

    // img upload
    var multer = require('multer'); // npm install multer --save
    var upload = multer({dest: __dirname + '/../../public/uploads'});
    app.post("/api/upload", upload.single('myFile'), uploadImage);

    function uploadImage(req, res) {
        console.log("aaa");
        var userId = req.body.userId;

        var myFile = req.file;
        if (myFile == null || myFile == undefined) {
            return;
        }

        var filename = myFile.filename;     // new file name in upload folder
        var url = '/uploads/' + filename;

        model
            .userModel
            .findUserById(userId)
            .then(function (user) {
                user.avatar = url;
                user.save();
                var callbackUrl = "/#!/profile";
                res.redirect(callbackUrl);
            });
    }

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
            .findUserByUsername(username)
            .then(function (user) {
                if (user.username === username && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    done(null, false);
                }
            }, function (err) {
                return done(err);
            });
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

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

    function checkAdmin(req, res) {
        if (req.isAuthenticated() && req.user.roles.indexOf('ADMIN') > -1) {
            res.json(req.user);
        } else {
            res.json('0');
        }
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
                    res.json(user);
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

    function fuzzySearch(req, res) {
        var text = req.params.text;
        model
            .userModel
            .fuzzySearch(text)
            .then(function (users) {
                res.send(users);
            });
    }

    function followUser(req, res) {
        var userId = req.params.userId;
        var followId = req.params.followId;

        model
            .userModel
            .followUser(userId, followId)
            .then(function (user) {
                res.send(user);
            });
    }

    function unFollowUser(req, res) {
        var userId = req.params.userId;
        var unFollowId = req.params.unFollowId;

        model
            .userModel
            .unFollowUser(userId, unFollowId)
            .then(function (user) {
                res.send(user);
            });
    }

    function findFollowingForUser(req, res) {
        var userId = req.params.userId;
        model
            .userModel
            .findFollowingForUser(userId)
            .then(function (users) {
                res.send(users);
            });
    }

    function findFollowersForUser(req, res) {
        var userId = req.params.userId;
        model
            .userModel
            .findFollowersForUser(userId)
            .then(function (users) {
                res.send(users);
            });
    }

    function addFavoriteTrail(req, res) {
        var userId = req.params.userId;
        var trailId = req.params.trailId;
        model
            .userModel
            .addFavoriteTrail(userId, trailId)
            .then(function (user) {
                res.send(user);
            });
    }

    function removeFavoriteTrail(req, res) {
        var userId = req.params.userId;
        var trailId = req.params.trailId;
        model
            .userModel
            .removeFavoriteTrail(userId, trailId)
            .then(function (user) {
                res.send(user);
            });
    }

    function getAllUsers(req, res) {
        model
            .userModel
            .getAllUsers()
            .then(function (users) {
                res.send(users);
            });
    }
};