(function () {
  'use strict';

  // Prepare module for subsequent registration of controllers and delegates
  angular.module('timer', ['ngMaterial', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'src/timer/view/timer.html',
        controller: 'TimerController'
      });
    }]);

})();