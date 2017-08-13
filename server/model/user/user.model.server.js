module.exports = function (mongoose) {
    var userSchema = require('./user.schema.server.js')(mongoose);
    var userModel = mongoose.model('User', userSchema);

    var api = {
        'createUser': createUser,
        'findUserById': findUserById,
        'findUserByUsername': findUserByUsername,
        'findUserByCredentials': findUserByCredentials,
        'updateUser': updateUser,
        'addWebsite': addWebsite,
        'deleteWebsite': deleteWebsite,
        'removeWebsiteFromUser': removeWebsiteFromUser,
        'deleteUser': deleteUser,
        'findUserByGoogleId': findUserByGoogleId,
        'fuzzySearch': fuzzySearch,
        'followUser': followUser,
        'unFollowUser': unFollowUser,
        'findFollowingForUser': findFollowingForUser,
        'findFollowersForUser': findFollowersForUser,
        'addFavoriteTrail': addFavoriteTrail,
        'removeFavoriteTrail': removeFavoriteTrail
    };

    return api;

    // Function Definition Section

    function createUser(user) {
        user.roles = ['USER'];
        return userModel.create(user);
    }

    function findUserById(userId) {
        return userModel.findOne({_id: userId});
    }

    function findUserByUsername(uname) {
        return userModel.findOne({username: uname})
    }

    function findUserByCredentials(uname, pswrd) {
        return userModel.findOne({
            username: uname,
            password: pswrd
        });
    }

    function updateUser(userId, user) {
        return userModel.update({
            _id: userId
        }, user);
    }

    function addWebsite(userId, websiteId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.websites.push(websiteId);
                return user.save();
            });
    }

    function deleteWebsite(userId, websiteId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.websites.pull(websiteId);
                return user.save();
            });
    }

    function removeWebsiteFromUser(userId, websiteId) {
        userModel
            .find({_id: userId})
            .then(
                function (user) {
                    user.websites.pull(websiteId);
                    user.save();
                },
                function (error) {
                    console.log(error);
                }
            );
    }

    function deleteUser(userId) {
        return userModel.remove({
            _id: userId
        });
    }

    function findUserByGoogleId(googleId) {
        return userModel.findOne({'google.id': googleId});
    }

    function fuzzySearch(text) {
        return userModel.find({
            $or: [
                {username: {$regex: text}},
                {fistName: {$regex: text}},
                {lastName: {$regex: text}},
                {email: {$regex: text}}
            ]
        });
    }

    function followUser(userId, followId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.following.push(followId);
                return user.save();
            })
            .then(function (user) {
                return userModel
                    .findById(followId)
                    .then(function (followedUser) {
                        followedUser.followers.push(userId);
                        return followedUser.save();
                    });
            });
    }

    function unFollowUser(userId, unFollowId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.following.pull(unFollowId);
                return user.save();
            })
            .then(function (user) {
                return userModel
                    .findById(unFollowId)
                    .then(function (unFollowedUser) {
                        unFollowedUser.followers.pull(userId);
                        return unFollowedUser.save();
                    });
            });
    }

    function findFollowingForUser(userId) {
        return userModel
            .findById(userId)
            .populate('following')
            .then(function (user) {
               return user.following;
            });
    }

    function findFollowersForUser(userId) {
        return userModel
            .findById(userId)
            .populate('followers')
            .then(function (user) {
                return user.followers;
            });
    }

    function addFavoriteTrail(userId, trailId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.favoriteTrails.push(trailId);
                return user.save();
            });
    }

    function removeFavoriteTrail(userId, trailId) {
        return userModel
            .findById(userId)
            .then(function (user) {
                user.favoriteTrails.pull(trailId);
                return user.save();
            });
    }

};