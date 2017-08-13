(function () {
    angular
        .module("GoHiking")
        .controller("IndexController", IndexController)
        .controller("HeaderController", HeaderController)
        .controller("FooterController", FooterController)
        .controller("PageHeadController", PageHeadController);

    function IndexController($routeParams, IndexService, UserService, $rootScope, $scope, $window) {
        var vm = this;
        $rootScope.logout = logout;

        $scope.$on('$viewContentLoaded', function () {
            App.initComponents(); // init core components
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $window.location.reload();
                });
        }

        $scope.$on('g-places-autocomplete:select', function (event, data) {
            console.log('Event', event);
            console.log('Place data', data);
            console.log('Geometry', data.geometry.location.lat(), data.geometry.location.lng());
            var lat = data.geometry.location.lat();
            var lng = data.geometry.location.lng();

            IndexService
                .searchTrailsNear(lng, lat)
                .then(function (trails) {

                   vm.trails = trails;
                   console.log(trails);
                });
        });
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
})();