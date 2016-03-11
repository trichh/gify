angular.module('gifyApp')
.controller('FeedCtrl', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $location) {
  var ref = new Firebase("https://gify.firebaseio.com");
  $rootScope.authObj = $firebaseAuth(ref);
  $rootScope.loggedIn = true;
  
  $rootScope.authObj.$onAuth(function(authData) {
    if (authData) {
      $rootScope.loggedIn = true;
      var uid = authData.uid;
      var user = new Firebase("https://gify.firebaseio.com/users/"+uid); //gets a single user based on ID
      var obj = $firebaseObject(user); // turns that obj in firebase object

      obj.$loaded().then(function() {
        //loads the object from Firebase
        // reads username from Firebase
        $rootScope.user = obj;

      });

      var feed = new Firebase("https://gify.firebaseio.com/feed/"+uid); //Get feed of user's posts
      var array = $firebaseArray(feed); // asign it to an Firebase Array.
      

    } else {
      $rootScope.loggedIn = false;
      $location.path('/');
    }
  });
  
});