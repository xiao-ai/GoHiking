module.exports = function(app){
    // mongodb
    var mongoose = require('mongoose');
    var mongoDB = {
        local: 'mongodb://localhost/gohiking',
        server: 'mongodb://aix:xihaxiao@ds139801.mlab.com:39801/heroku_8htvz1gn'
    };

    if (process.env.MONGODB_URI) {
        console.log('-------------------------------');
        console.log(process.env.MONGODB_URI);
        mongoose.connect(mongoDB.server);
    } else {
        mongoose.connect(mongoDB.local);
    }
    mongoose.Promise = require('q').Promise;

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("connected!");
    });

    var models = require("./model/models.server.js")(mongoose);
    require("./services/user.service.server.js")(app, models);
};