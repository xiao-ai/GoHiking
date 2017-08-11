(function () {
    angular
        .module("GoHiking")
        .controller("IndexController", IndexController)
        .controller("HeaderController", HeaderController)
        .controller("FooterController", FooterController);

    function IndexController($routeParams, IndexService, $scope) {
        var vm = this;

        $scope.$on('$viewContentLoaded', function() {
            App.initComponents(); // init core components
        });
    }

    function HeaderController($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initHeader(); // init header
        });
    }

    function FooterController($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initFooter(); // init header
        });
    }
})();