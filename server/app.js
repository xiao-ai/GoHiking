module.exports = function(app){
    // mongodb
    var mongoose = require('mongoose');
    var mongoDB = {
        local: 'mongodb://localhost/gohiking',
        server: 'mongodb://admin:admin@ds151242.mlab.com:51242/heroku_56lb72zw'
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