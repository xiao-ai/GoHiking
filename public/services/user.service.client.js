(function () {
    angular
        .module("GoHiking")
        .factory('UserService', UserService);

    function UserService($http, $rootScope) {
        var services = {
            "register": register,
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "login": login,
            "logout": logout,
            "setCurrentUser": setCurrentUser
        };

        return services;

        function register(user) {
            var url = "/api/register";
            return $http.post(url, user);
        }

        function login(user) {
            var url = "/api/login";
            return $http.post(url, user);
        }

        function logout(user) {
            return $http.post("/api/logout");
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function createUser(user) {
            var url = "/api/user";
            return $http.post(url, user);
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }
})();