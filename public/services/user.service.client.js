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
            "setCurrentUser": setCurrentUser,
            "fuzzySearch": fuzzySearch,
            "followUser": followUser,
            "unFollowUser": unFollowUser,
            "findFollowingForUser": findFollowingForUser,
            "findFollowersForUser": findFollowersForUser,
            "addFavoriteTrail": addFavoriteTrail,
            "removeFavoriteTrail": removeFavoriteTrail,
            "getAllUsers": getAllUsers
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

        function fuzzySearch(text) {
            var url = "/api/user/fuzzySearch/" + text;
            return $http.get(url);
        }

        function followUser(userId, followId) {
            var url = "/api/user/" + userId + "/follow/" + followId;
            return $http.put(url);
        }

        function unFollowUser(userId, unFollowId) {
            var url = "/api/user/" + userId + "/unfollow/" + unFollowId;
            return $http.put(url);
        }

        function findFollowingForUser(userId) {
            var url = "/api/user/" + userId + "/following";
            return $http.get(url);
        }

        function findFollowersForUser(userId) {
            var url = "/api/user/" + userId + "/followers";
            return $http.get(url);
        }

        function addFavoriteTrail(userId, trailId) {
            var url = "/api/user/" + userId + "/addFavoriteTrail/" + trailId;
            return $http.put(url);
        }

        function removeFavoriteTrail(userId, trailId) {
            var url = "/api/user/" + userId + "/removeFavoriteTrail/" + trailId;
            return $http.put(url);
        }

        function getAllUsers() {
            var url = "/api/getAllUsers";
            return $http.get(url);
        }

    }
})();