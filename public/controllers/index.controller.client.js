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
    }

    function HeaderController($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });
    }

    function FooterController($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }

    function PageHeadController($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }
})();