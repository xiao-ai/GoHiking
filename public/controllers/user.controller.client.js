(function () {
    angular
        .module("GoHiking")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ResetController", ResetController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            if (username === "" || username == undefined || password === "" || password === undefined) {
                vm.error = "username and password are required!";
                return;
            }

            UserService
                .login({
                    username: username,
                    password: password
                })
                .then(
                    function (response) {
                        if (response.data) {
                            UserService.setCurrentUser(response.data);
                            var user = response.data;
                            $location.url("/profile");
                        }
                    },
                    function (error) {
                        vm.error = "username and password does not match!";
                    });
        }
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

    function ProfileController($timeout, $location, UserService, $rootScope) {
        var vm = this;
        vm.logout = logout;

        renderUser($rootScope.currentUser);

        function renderUser(user) {
            vm.user = user;
            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;
        }

        function updateUser(user) {
            UserService
                .updateUser(user._id, user)
                .then(function () {
                    vm.updated = "Profile changes saved!";
                    $timeout(function () {
                        vm.updated = null;
                    }, 3000);
                });
        }

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(function () {
                    $location.url("/");
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url("/");
                });
        }
    }
})();