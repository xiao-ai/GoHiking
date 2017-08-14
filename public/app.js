(function () {
    var GoHiking = angular.module("GoHiking", ['ngRoute', 'google.places', 'uiGmapgoogle-maps']);
    GoHiking.controller("GoHikingController", GoHikingController);
    GoHiking.run(Settings);

    function GoHikingController($scope, $rootScope, $location, $window) {
        $scope.$on('$viewContentLoaded', function () {
            App.initComponents(); // init core components
            $rootScope.currentPage = $location.path();
        });

        $rootScope.refresh = function() {
            $window.location.reload();
        };
    }

    /* Setup global settings */
    function Settings($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: '../assets',
            globalPath: '../assets/global',
            layoutPath: '../assets/layouts/layout3'
        };

        $rootScope.settings = settings;

        return settings;
    }
})();