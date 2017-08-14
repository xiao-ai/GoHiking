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
                templateUrl: "views/trail/trail.html",
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
                resolve: {loggedin: checkLoggedin}
            })
            .when('/search/:text', {
                templateUrl: "views/user/search.view.client.html",
                controller: "SearchUserController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedin}
            })
            .when('/following', {
                templateUrl: "views/user/search.view.client.html",
                controller: "FollowingController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedin}
            })
            .when('/followers', {
                templateUrl: "views/user/search.view.client.html",
                controller: "FollowersController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedin}
            })
            .when('/trail/:trailId/lng/:lng/lat/:lat', {
                templateUrl: "views/index/trail.view.client.html",
                controller: "TrailController",
                controllerAs: "model"
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
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
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
})();