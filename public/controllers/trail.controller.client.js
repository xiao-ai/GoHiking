(function () {
    angular
        .module("GoHiking")
        .controller("TrailController", TrailController);

    function TrailController($routeParams, TrailService, UserService, $rootScope,
                             $scope, $window, $sce, $location, $timeout, $q, $http) {
        var vm = this;
        $rootScope.logout = logout;
        vm.trustThisContent = trustThisContent;
        vm.addFavoriteTrail = addFavoriteTrail;
        vm.removeFavoriteTrail = removeFavoriteTrail;

        checkLoggedin();

        function checkLoggedin() {
            var deferred = $q.defer();

            $http.get('/api/loggedin').then(function (res) {
                var user = res.data;
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    return;
                }
            });
            return deferred.promise;
        }

        $scope.$on('$viewContentLoaded', function () {
            App.initComponents(); // init core components
        });

        $scope.$on('g-places-autocomplete:select', function (event, data) {
            // console.log('Event', event);
            // console.log('Place data', data);
            // console.log('Geometry', data.geometry.location.lat(), data.geometry.location.lng());
            vm.lat = data.geometry.location.lat();
            vm.lng = data.geometry.location.lng();

            TrailService
                .searchTrailsNear(vm.lng, vm.lat)
                .then(function (response) {

                    vm.trails = response.data.filter(function (trail) {
                        return trail.description != "";
                    });
                    console.log(vm.trails);
                });
        });

        function trustThisContent(html) {
            return $sce.trustAsHtml(html);
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/trail');
                });
        }

        function addFavoriteTrail(trailId) {
            var user = $rootScope.currentUser;
            if (user == null || user == undefined) {
                vm.error = "You need to login. Redirecting to login page in 3 seconds...";
                $timeout(function () {
                    $location.url('/login');
                    return;
                }, 2000);
            } else {
                UserService
                    .addFavoriteTrail(user._id, trailId)
                    .then(function (response) {
                        $rootScope.currentUser = response.data;

                        TrailService
                            .searchTrailsNear(vm.lng, vm.lat)
                            .then(function (response) {
                                vm.addSuccess = "Added to favorites!";
                                $timeout(function () {
                                    vm.addSuccess = "";
                                }, 2000);
                                vm.trails = response.data.filter(function (trail) {
                                    return trail.description != "";
                                });
                            });
                    });
            }
        }

        function removeFavoriteTrail(trailId) {
            var user = $rootScope.currentUser;
            UserService
                .removeFavoriteTrail(user._id, trailId)
                .then(function (response) {
                    $rootScope.currentUser = response.data;

                    TrailService
                        .searchTrailsNear(vm.lng, vm.lat)
                        .then(function (response) {
                            vm.removeSuccess = "Removed from favorites!";
                            $timeout(function () {
                                vm.removeSuccess = "";
                            }, 2000);
                            vm.trails = response.data.filter(function (trail) {
                                return trail.description != "";
                            });

                        });
                });

        }
    }
})();