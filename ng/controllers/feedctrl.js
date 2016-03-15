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

      var images = new Firebase("https://gify.firebaseio.com/images/"+uid+"/posts/"); //Get feed of user's posts
      var imgArray = $firebaseArray(images); // asign it to an Firebase Array.
      
      imgArray.$loaded().then(function() {
        //loads the object from Firebase
        // reads username from Firebase
        $scope.images = imgArray;
        console.log("DATA",  $scope.images[0].$value);
      });

    } else {
      $rootScope.loggedIn = false;
      $location.path('/');
    };// end IF
    
  });// ends $onAuth
  
});