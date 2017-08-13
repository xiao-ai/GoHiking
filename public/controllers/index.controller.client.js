(function () {
    angular
        .module("GoHiking")
        .controller("IndexController", IndexController)
        .controller("HeaderController", HeaderController)
        .controller("FooterController", FooterController)
        .controller("PageHeadController", PageHeadController)
        .controller("TrailController", TrailController);

    function IndexController($routeParams, IndexService, UserService, $rootScope,
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

            IndexService
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
                    $window.location.reload();
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

                        IndexService
                            .searchTrailsNear(vm.lng, vm.lat)
                            .then(function (response) {
                                vm.addSuccess = "Favorited";
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

                    IndexService
                        .searchTrailsNear(vm.lng, vm.lat)
                        .then(function (response) {
                            vm.removeSuccess = "Unfavorited";
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

    function HeaderController($rootScope, $scope) {
        $rootScope.logout = logout;
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $window.location.reload();
                });
        }
    }

    function FooterController($rootScope, $scope) {
        $rootScope.logout = logout;
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $window.location.reload();
                });
        }
    }

    function PageHeadController($rootScope, $scope) {
        $rootScope.logout = logout;
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $window.location.reload();
                });
        }
    }

    function TrailController($scope, $routeParams, IndexService, UserService) {
        var vm = this;
        var trailId = $routeParams.trailId;
        var lng = parseFloat($routeParams.lng);
        var lat = parseFloat($routeParams.lat);
        $scope.map = {center: {latitude: 45, longitude: -73}, zoom: 8};

        // var uluru = {lat: lat, lng: lng};
        // var map = new google.maps.Map(document.getElementById('map'), {
        //     zoom: 4,
        //     center: uluru
        // });
        // var marker = new google.maps.Marker({
        //     position: uluru,
        //     map: map
        // });
    }
})();