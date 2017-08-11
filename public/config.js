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
                $location.url('/login');
            }
        });
        return deferred.promise;
    };
})();