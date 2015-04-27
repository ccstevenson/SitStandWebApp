(function () {
  'use strict';

  angular.module('users')
    .factory('firebaseFactory', ['$firebaseObject', FirebaseFactory]);

  function FirebaseFactory($firebaseObject) {
    return {
      loadUserData: function (userId) {
        // create a reference to the Firebase where we will store our data
        //var randomRoomId = Math.round(Math.random() * 100000000);
        var ref = new Firebase("https://sit-stand.firebaseio.com/" + userId);

        // this uses AngularFire to create the synchronized array
        return $firebaseObject(ref);
      }
    }
  }
})();