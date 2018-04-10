(function () {
  angular
    .module("GoHiking")
    .factory("TrailService", TrailService);

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
      let url = "/api/trail/" + lng + "/" + lat;
      return $http.get(url);
    }

    function getTrailById(trailId) {
      var url = "/api/trail/" + trailId;
      return $http.get(url);
    }

    function getTrailAttributes(trailId) {
      var url = "/api/trail/attributes/" + trailId;
      return $http.get(url);
    }

    function getTrailPhotos(trailId) {
      var url = "/api/trail/photos/" + trailId;
      return $http.get(url);
    }

    function getTrailMaps(trailId) {
      var url = "/api/trail/maps/" + trailId;
      return $http.get(url);
    }

    function getWeatherData(lat, lng) {
      // var url = weatherUrl + "lat=" + lat + "&lon=" + lng + "&units=imperial" + "&appid=" + weatherKey;
      var url = "/api/trail/weather/" + lat + "/" + lng;
      return $http.get(url);
    }
  }
})();