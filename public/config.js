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
            .otherwise({
                redirectTo: "/index"
            });

        // allow youtube through
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            '*://www.youtube.com/**'
        ]);
    }

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http.get('/api/loggedin').then(function (res) {
            var user = res.data;
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                $rootScope.error = "You need to log in.";
                deferred.reject();
                $location.url('/index');
            }
        });
        return deferred.promise;
    };
})();