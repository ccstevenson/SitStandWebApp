(function () {
  'use strict';

  angular.module('splash', ['ngMaterial', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'src/splash/view/splash.html',
        controller: 'SplashController'
      });
    }]);

})();