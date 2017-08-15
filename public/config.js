/**
 * Created by xiao on 6/13/17.
 */
(function () {
    angular
        .module("GoHiking")
        .config(config);

    function config($routeProvider, $sceDelegateProvider) {
        $routeProvider
            .when('/index', {
                templateUrl: "views/index/index.html",
                controller: "IndexController",
                controllerAs: "model"
            })
            .when('/trail', {
                templateUrl: "views/trail/trail.view.client.html",
                controller: "TrailController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/register', {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/reset', {
                templateUrl: "views/user/reset.view.client.html",
                controller: "ResetController",
                controllerAs: "model"
            })
            .when('/profile', {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {currentUser: checkLoggedin}
            })
            .when('/search/:text', {
                templateUrl: "views/user/search.view.client.html",
                controller: "SearchUserController",
                controllerAs: "model",
                resolve: {currentUser: checkLoggedin}
            })
            .when('/following', {
                templateUrl: "views/user/search.view.client.html",
                controller: "FollowingController",
                controllerAs: "model",
                resolve: {currentUser: checkLoggedin}
            })
            .when('/followers', {
                templateUrl: "views/user/search.view.client.html",
                controller: "FollowersController",
                controllerAs: "model",
                resolve: {currentUser: checkLoggedin}
            })
            .when('/trail/:trailId', {
                templateUrl: "views/trail/trail.info.view.client.html",
                controller: "TrailInfoController",
                controllerAs: "model",
                resolve: {currentUser: checkLoggedin}
            })
            .when('/user', {
                templateUrl: "views/user/user.view.client.html",
                controller: "UserController",
                controllerAs: "model",
                resolve: {currentUser: checkAdmin}
            })
            .otherwise({
                redirectTo: "/index"
            });

        // allow youtube through
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '*://www.youtube.com/**',
            '**api.transitandtrails.org/**'
        ]);
    }

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, $window) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').then(function (res) {
            var user = res.data;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve(user);
            } else {
                $window.alert("You need to log in. Redirecting to login page in 3 seconds");
                $timeout(function () {
                    deferred.reject();
                    $location.url('/login');
                }, 2000);
            }
        });
        return deferred.promise;
    };

    var checkAdmin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/checkAdmin').then(function (res) {
            var user = res.data;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve(user);
            } else {
                deferred.reject();
                $location.url('/index');
            }
        });
        return deferred.promise;
    };


})();