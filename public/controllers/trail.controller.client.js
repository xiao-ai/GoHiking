(function () {
    angular
        .module("GoHiking")
        .controller("TrailController", TrailController)
        .controller("TrailInfoController", TrailInfoController);

    function TrailController($routeParams, TrailService, UserService, $rootScope,
                             $scope, $window, $sce, $location, $timeout, $q, $http, NgMap,
                             $anchorScroll) {
        var vm = this;
        $rootScope.logout = logout;
        vm.trustThisContent = trustThisContent;
        vm.addFavoriteTrail = addFavoriteTrail;
        vm.removeFavoriteTrail = removeFavoriteTrail;
        vm.scrollTo = scrollTo;

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
                    renderMaps();
                });
        });

        function renderMaps() {
            NgMap.getMap().then(function (map) {
                map.setCenter({lat: parseFloat(vm.lat), lng: parseFloat(vm.lng)});
                // console.log(map.getCenter());
                // console.log('markers', map.markers);
                // console.log('shapes', map.shapes);
                var markers = [];
                for (t in vm.trails) {
                    var id = vm.trails[t].id;
                    var lat = parseFloat(vm.trails[t].latitude);
                    var lng = parseFloat(vm.trails[t].longitude);
                    var position = [lat, lng];
                    var marker = {
                        id: id,
                        position: position
                    };
                    markers.push(marker);
                }
                vm.markers = markers;
            });
        }

        function scrollTo(e, marker) {
            var id = 'marker_' + marker.id;

            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        }

        function trustThisContent(html) {
            return $sce.trustAsHtml(html);
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/index');
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

    function TrailInfoController($routeParams, TrailService, UserService, $rootScope,
                                 $scope, $window, $sce, $location, $timeout, $q, $http, NgMap,
                                 $anchorScroll) {
        var vm = this;
        var trailId = $routeParams.trailId;
        vm.trustThisContent = trustThisContent;
        vm.addFavoriteTrail = addFavoriteTrail;
        vm.removeFavoriteTrail = removeFavoriteTrail;

        checkLoggedin();

        TrailService
            .getTrailById(trailId)
            .then(function (response) {
                vm.trail = response.data[0];
                renderMaps();
                renderWeather();
            });

        TrailService
            .getTrailAttributes(trailId)
            .then(function (response) {
                vm.attributes = response.data;
            });

        TrailService
            .getTrailPhotos(trailId)
            .then(function (response) {
                var photos = [];
                for (p in response.data) {
                    photos.push(response.data[p].medium.replace("//", "https://"))
                }
                vm.photos = photos;
            });


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

        function renderMaps() {
            NgMap.getMap().then(function (map) {
                map.setCenter({lat: parseFloat(vm.trail.latitude), lng: parseFloat(vm.trail.longitude)});
                vm.position = [parseFloat(vm.trail.latitude), parseFloat(vm.trail.longitude)];
            });
        }

        function renderWeather() {
            var lat = vm.trail.latitude;
            var lng = vm.trail.longitude;
            TrailService
                .getWeatherData(lat, lng)
                .then(function (response) {
                    var data = response.data.list;
                    var weatherList = [];
                    for (w in data) {
                        if (w % 2 != 0) {
                            weatherList.push(data[w]);
                        }
                    }
                    vm.weatherList = weatherList;
                });

        }

        function trustThisContent(html) {
            return $sce.trustAsHtml(html);
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