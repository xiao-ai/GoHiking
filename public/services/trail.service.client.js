(function () {
    angular
        .module("GoHiking")
        .factory("TrailService", TrailService);

    var weatherKey = "b012af5c98c960b4c44662551d3830bd";
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    var key = "e55af6a71db15349e0eff7663ed2dbfce8657bf6f82c836a36858e6e9ef90230";
    var trails_url = "https://api.transitandtrails.org/api/v1/";

    function TrailService($http) {
        var services = {
            "searchTrailsNear": searchTrailsNear,
            "getTrailById": getTrailById,
            "getTrailAttributes": getTrailAttributes,
            "getTrailPhotos": getTrailPhotos,
            "getTrailMaps": getTrailMaps,
            "getWeatherData": getWeatherData
        };
        return services;

        function searchTrailsNear(lng, lat) {
            var url = trails_url + "trailheads?" + "distance=30&longitude=" + lng + "&latitude=" + lat + "&key=" + key;
            return $http.get(url);
        }

        function getTrailById(trailId) {
            var url = trails_url + "trailheads?id=" + trailId + "&key=" + key;
            return $http.get(url);
        }

        function getTrailAttributes(trailId) {
            var url = trails_url + "trailheads/" + trailId + "/attributes" + "?key=" + key;
            return $http.get(url);
        }

        function getTrailPhotos(trailId) {
            var url = trails_url + "trailheads/" + trailId + "/photos" + "?key=" + key;
            return $http.get(url);
        }

        function getTrailMaps(trailId) {
            var url = trails_url + "trailheads/" + trailId + "/maps" + "?key=" + key;
            return $http.get(url);
        }

        function getWeatherData(lat, lng) {
            var url = weatherUrl + "lat=" + lat + "&lon=" + lng + "&units=imperial" + "&appid=" + weatherKey;
            return $http.get(url);
        }
    }
})();