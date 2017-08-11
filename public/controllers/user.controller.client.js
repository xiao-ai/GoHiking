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

    function RegisterController($location, $timeout, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, email, password, rpassword) {
            if (username === undefined || username === null || username === "" || password === undefined
                || password === "") {
                return;
            }

            if (password !== rpassword) {
                vm.error = "Password does not match.";
                return;
            }

            var user = {
                username: username,
                password: password,
                email: email,
                followers: [],
                following: []
            };

            UserService
                .register(user)
                .then(
                    function (response) {
                        var newUser = response.data;
                        UserService.setCurrentUser(newUser);
                        $location.url("/profile");
                    },
                    function (err) {
                        if (err.data.code == 11000) {
                            vm.error = "username or email already exists";
                            return;
                        }
                    });
        }
    }

    function ResetController() {
        var vm = this;
        console.log("reset");
    }

    function ProfileController($scope) {
        console.log("profile");
    }
})();