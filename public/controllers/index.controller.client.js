(function () {
    angular
        .module("GoHiking")
        .controller("IndexController", IndexController)
        .controller("HeaderController", HeaderController)
        .controller("FooterController", FooterController)
        .controller("PageHeadController", PageHeadController);

    function IndexController(UserService, $rootScope, $scope, $window) {
        var vm = this;
        $rootScope.logout = logout;

        $scope.$on('$viewContentLoaded', function () {
            App.initComponents(); // init core components
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/index');
                    $window.location.reload();
                });
        }
    }

    function HeaderController($rootScope, $scope, $window) {
        $rootScope.logout = logout;
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/index');
                    $window.location.reload();
                });
        }
    }

    function FooterController($rootScope, $scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }

    function PageHeadController($rootScope, $scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }

})();