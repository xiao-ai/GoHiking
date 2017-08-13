(function () {
    angular
        .module("GoHiking")
        .factory("IndexService", IndexService);

    var key = "e55af6a71db15349e0eff7663ed2dbfce8657bf6f82c836a36858e6e9ef90230";
    var trails_url = "https://api.transitandtrails.org/api/v1/trailheads?key=" + key;

    function IndexService($http) {
        var services = {
            "searchTrailsNear": searchTrailsNear
        };
        return services;

        function searchTrailsNear(lng, lat) {
            var url = trails_url  + "&distance=50&longitude=" + lng + "&latitude=" + lat;
            return $http.get(url);
        }
    }
})();