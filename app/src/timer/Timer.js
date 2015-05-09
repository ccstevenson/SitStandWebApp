(function () {
  'use strict';

  angular.module('timer', ['ngMaterial', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/timer', {
        templateUrl: 'src/timer/view/timer.html',
        controller: 'TimerController'
      });
    }]);

})();