(function () {
    angular
        .module("GoHiking")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ResetController", ResetController)
        .controller("ProfileController", ProfileController);

    function LoginController($routeParams, IndexService, $scope) {
        var vm = this;
        console.log("login");
    }

    function RegisterController() {
        var vm = this;
        console.log("register");
    }

    function ResetController() {
        var vm = this;
        console.log("reset");
    }

    function ProfileController($scope) {
        console.log("profile");
    }
})();