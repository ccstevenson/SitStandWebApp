(function () {

  angular.module('users')

    // Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('timer', ['$interval', 'dateFilter', 'GoalTracker', 'TimeService',
      function ($interval, dateFilter, GoalTracker, TimeService) {
        // return the directive link function. (compile function not needed)
        return function (scope, element, attrs) {
          var startTimestamp,  // date format
            stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
            if (startTimestamp !== "Loading..." && !TimeService.pause) {
              element.text(calculateDifference());
            }
          }

          function calculateDifference() {
            var currentTimestamp = Date.now();

            var diff = Math.round((currentTimestamp - startTimestamp) / 1000);

            GoalTracker.progress = diff;
            GoalTracker.percent = 100 * (diff / GoalTracker.goal); // Move into setter in service.

            var d = Math.floor(diff / (24 * 60 * 60));
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;

            return result = d + " : " + h + " : " + m + " : " + s;
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.timer, function (value) {
            startTimestamp = value;

            if (value !== "Loading...") {
              updateTime();
            }
          });

          stopTime = $interval(updateTime, 1000);

          element.on('$destroy', function () {
            $interval.cancel(stopTime);
          });
        }
      }])

    .service('GoalTracker', function () {
      return {
        goal: 1800,
        progress: 0,
        percent: 0

        //setPercent: function() {
        //
        //}
      };
    })

    .directive('timerRewrite', function () {
      return {
        restrict: 'E',
        template: 'timer-rewrite.html'
      }
    })

    .service('TimeService', function () { // TODO: remove, put this and any template pieces in the timer directive.
      return {
        pause: false
      }
    })

    .controller('TimerController', function ($scope, firebaseFactory, GoalTracker, TimeService, $firebaseAuth, $firebaseObject) {
      var ref = firebaseFactory.loadUserData('User1');
      var syncObject = $firebaseObject(ref);
      syncObject.$bindTo($scope, "data").then(function () {
        onFirebaseDataLoad();
      });

      // Move to AuthService.
      var auth = $firebaseAuth(syncObject);

      $scope.facebookLogin = function () {
        ref.authWithOAuthPopup("facebook", function (error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        })
      };

      initializeView();

      function initializeView() {
        // Populates interface while Firebase is resolving.
        if (!$scope.hasOwnProperty('data')) {
          $scope.data = {};

          $scope.toggleButtonString = "Loading...";
          $scope.pauseButtonString = "Pause";
          $scope.data.latestTimestamp = "Loading...";
          $scope.GoalTracker = GoalTracker;
          $scope.TimeService = TimeService;
        }
      }

      function onFirebaseDataLoad() {
        setToggleButtonString();
      }

      $scope.sitOrStand = function () {
        recordTimestamp();
        $scope.data.currentlyStanding = !$scope.data.currentlyStanding;
        setToggleButtonString();
      };

      $scope.pause = function () {
        TimeService.pause = !TimeService.pause;
        $scope.pauseButtonString = TimeService.pause ? "Pause" : "Resume";
      };

      function setToggleButtonString() {
        $scope.toggleButtonString = $scope.data.currentlyStanding ? "Sit Down" : "Stand up";
      }

      function recordTimestamp() {
        var timestamp = Date.now();
        var readableDateKey = new Date().yyyymmdd();

        var timestampObj = {};
        timestampObj[timestamp] = "standing";

        if (!$scope.data.hasOwnProperty('timestamps')) { // This is the first entry ever for this user. Move into user account creation.
          $scope.data['timestamps'] = {};
        }

        if (!$scope.data.timestamps.hasOwnProperty(readableDateKey)) { // This is the first entry for today.
          $scope.data.timestamps[readableDateKey] = {};
        }

        $scope.data.timestamps[readableDateKey][timestamp] = $scope.data.currentlyStanding;

        $scope.data.latestTimestamp = timestamp;
      }

      Date.prototype.yyyymmdd = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();
        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
      };
    }
  )
}());
