module.exports = function (mongoose) {
    var userModel = require('./user/user.model.server')(mongoose);

    var models = {
        userModel: userModel
    };

    return models;
};

