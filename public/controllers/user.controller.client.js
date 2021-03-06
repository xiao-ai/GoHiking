(function () {
    angular
        .module("GoHiking")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ResetController", ResetController)
        .controller("ProfileController", ProfileController)
        .controller("SearchUserController", SearchUserController)
        .controller("FollowingController", FollowingController)
        .controller("FollowersController", FollowersController)
        .controller("UserController", UserController);

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
                            var user = response.data;
                            if (user.status == 'INACTIVE') {
                                vm.error = "This user has been disabled";
                                return;
                            } else {
                                UserService.setCurrentUser(response.data);
                                $location.url("/profile");
                            }
                        } else {
                            vm.error = "user does not exists!";
                        }
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
                following: [],
                favoriteTrails: [],
                avatar: "../assets/layouts/layout3/img/avatar.png",
                status: 'ACTIVE'
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

    function ProfileController($timeout, $location, UserService, $rootScope, $window) {
        var vm = this;
        $rootScope.logout = logout;
        renderUser($rootScope.currentUser);

        function renderUser(user) {
            vm.user = user;
            vm.updateProfile = updateProfile;
            vm.updatePassword = updatePassword;
            vm.deleteUser = deleteUser;
        }

        function updateProfile(user) {
            UserService
                .updateUser(user._id, user)
                .then(function () {
                    vm.updated = "Profile changes saved!";
                    $timeout(function () {
                        vm.updated = null;
                    }, 3000);
                });
        }

        function updatePassword(user, password, rpassword) {
            if (password !== rpassword) {
                vm.error = "password does not match!";
                $timeout(function () {
                    vm.error = null;
                    return;
                }, 3000);
            }

            UserService
                .updateUser(user._id, {password: password})
                .then(function () {
                    vm.updated = "Password changes saved!";
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
                    $location.url('/index');
                    $window.location.reload();
                });
        }
    }

    function SearchUserController($routeParams, $location, UserService, $rootScope, $route) {
        var vm = this;
        vm.search = search;
        vm.follow = follow;
        vm.unFollow = unFollow;
        vm.type = 'search';

        var urlText = $routeParams.text;

        if (urlText != 'null') {
            search(urlText);
        }

        function search(text) {
            vm.text = text;
            UserService
                .fuzzySearch(text)
                .then(function (response) {
                    vm.users = response.data.filter(function (user) {
                        return user._id != $rootScope.currentUser._id;
                    });
                    return;
                });
        }

        function follow(followId) {
            var user = $rootScope.currentUser;

            UserService
                .followUser(user._id, followId)
                .then(function () {
                    $location.url('/search/' + vm.text);
                    $route.reload();
                });
        }

        function unFollow(unFollowId) {
            var user = $rootScope.currentUser;

            UserService
                .unFollowUser(user._id, unFollowId)
                .then(function () {
                    $location.url('/search/' + vm.text);
                    $route.reload();
                });
        }
    }

    function FollowingController(UserService, $rootScope, $location, $route) {
        var vm = this;
        var user = $rootScope.currentUser;
        vm.follow = follow;
        vm.unFollow = unFollow;

        UserService
            .findFollowingForUser(user._id)
            .then(function (res) {
               vm.users = res.data;
            });

        function follow(followId) {
            var user = $rootScope.currentUser;

            UserService
                .followUser(user._id, followId)
                .then(function () {
                    $location.url('/search/' + vm.text);
                    $route.reload();
                });
        }

        function unFollow(unFollowId) {
            var user = $rootScope.currentUser;

            UserService
                .unFollowUser(user._id, unFollowId)
                .then(function () {
                    $location.url('/search/' + vm.text);
                    $route.reload();
                });
        }
    }

    function FollowersController(UserService, $rootScope, $location, $route) {
        var vm = this;
        var user = $rootScope.currentUser;
        vm.follow = follow;
        vm.unFollow = unFollow;

        UserService
            .findFollowersForUser(user._id)
            .then(function (res) {
                vm.users = res.data;
            });

        function follow(followId) {
            var user = $rootScope.currentUser;

            UserService
                .followUser(user._id, followId)
                .then(function () {
                    $route.reload();
                });
        }

        function unFollow(unFollowId) {
            var user = $rootScope.currentUser;

            UserService
                .unFollowUser(user._id, unFollowId)
                .then(function () {
                    $route.reload();
                });
        }
    }

    function UserController(UserService, $q, $http, $rootScope, $location, $window, $scope) {
        var vm = this;
        vm.disableUser = disableUser;
        vm.enableUser = enableUser;
        vm.findUserById = findUserById;
        vm.updateProfile = updateProfile;

        UserService
            .getAllUsers()
            .then(function (response) {
               vm.users = response.data;
            });

        function disableUser(userId) {
            UserService
                .updateUser(userId, {status: 'INACTIVE'})
                .then(function () {
                    UserService
                        .getAllUsers()
                        .then(function (response) {
                            vm.users = response.data;
                        });
                });
        }

        function enableUser(userId) {
            UserService
                .updateUser(userId, {status: 'ACTIVE'})
                .then(function () {
                    UserService
                        .getAllUsers()
                        .then(function (response) {
                            vm.users = response.data;
                        });
                });
        }

        function findUserById(userId) {
            console.log(userId);
            UserService
                .findUserById(userId)
                .then(function (response) {
                    vm.user = response.data;
                    $('#userModal').modal('show');
                });
        }

        function updateProfile(user) {
            var userId = user._id;
            var user = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            };
            if($('#isAdmin1').is(':checked') || $('#isAdmin2').is(':checked')) {
                user.roles = ['USER', 'ADMIN'];
            } else {
                user.roles = ['USER'];
            }
            console.log(user);
            UserService
                .updateUser(userId, user)
                .then(function () {
                    UserService
                        .getAllUsers()
                        .then(function (response) {
                            vm.users = response.data;
                            $('#userModal').modal('hide');
                        });
                });
        }
    }
})();