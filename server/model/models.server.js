module.exports = function (mongoose) {
    var userModel = require('./user/user.model.server')(mongoose);
    // var websiteModel = require('./website/website.model.server')(mongoose, userModel);
    // var pageModel = require('./page/page.model.server')(mongoose, websiteModel);
    // var widgetModel = require('./widget/widget.model.server')(mongoose, pageModel);

    var models = {
        userModel: userModel
    };

    return models;
};

