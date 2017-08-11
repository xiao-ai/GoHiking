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
        'findUserByGoogleId': findUserByGoogleId
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
        }, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        });
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
        console.log(googleId);
        return userModel.findOne({'google.id': googleId});
    }

};