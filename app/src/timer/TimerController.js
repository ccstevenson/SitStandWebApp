(function () {

  angular
    .module('users')
    .controller('TimerController', [
      '$scope', 'firebaseFactory',
      TimerController
    ])

    // Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('myCurrentTime', ['$interval', 'dateFilter',
      function ($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function (scope, element, attrs) {
          var startTimestamp,  // date format
            stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
            startTimestamp = new Date(startTimestamp.getTime() + 1000);

            element.text(startTimestamp);
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.myCurrentTime, function (value) {
            startTimestamp = new Date(value);
            updateTime();
          });

          stopTime = $interval(updateTime, 1000);

          // listen on DOM destroy (removal) event, and cancel the next UI update
          // to prevent updating time after the DOM element was removed.
          element.on('$destroy', function () {
            $interval.cancel(stopTime);
          });
        }
      }]);
  ;

  function TimerController($scope, firebaseFactory) {

    var syncObject = firebaseFactory.loadUserData('User1');
    syncObject.$bindTo($scope, "data").then(function () {
      onFirebaseDataLoad();
    });

    initializeView();

    function initializeView() {
      // Populates interface while Firebase is resolving.
      if (!$scope.hasOwnProperty('data')) {
        $scope.data = {};

        $scope.toggleButtonString = "Loading...";
        $scope.data.latestTimestamp = "Loading...";
      }
    }

    function onFirebaseDataLoad() {
      setToggleButtonString();
      setClockTime();
    }

    $scope.sitOrStand = function () {
      recordTimestamp();
      $scope.data.currentlyStanding = !$scope.data.currentlyStanding;
      setToggleButtonString();
    };

    function setToggleButtonString() {
      $scope.toggleButtonString = $scope.data.currentlyStanding ? "Sit Down" : "Stand up";
    }

    function recordTimestamp() {
      var timestamp = Date.now();
      var readableDateKey = new Date().yyyymmdd();

      var timestampObj = {};
      timestampObj[timestamp] = "standing";

      $scope.data.timestamps[readableDateKey][timestamp] = "standing";

      $scope.data.latestTimestamp = timestamp;
      setClockTime();
    }

    function setClockTime() {
      $scope.clockTime = timeSince(new Date($scope.data.latestTimestamp));
    }

    function timeSince(date) {
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }

    Date.prototype.yyyymmdd = function () {
      var yyyy = this.getFullYear().toString();
      var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = this.getDate().toString();
      return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
    };

  }


})();
