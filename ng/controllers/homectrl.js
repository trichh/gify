angular.module('gifyApp')
.controller('HomeCtrl', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $location) {
  var ref = new Firebase("https://gify.firebaseio.com");
  $rootScope.authObj = $firebaseAuth(ref);
  
  $rootScope.loggedIn = false;
  
  // registering user
  $scope.register = function() {
    $scope.authObj.$createUser({
      email: $scope.newuser.email,
      password: $scope.newuser.password
    })
    .then(function(userData) {
      // creating username in database
      var ref = new Firebase("https://gify.firebaseio.com/users/"+userData.uid);
      var user = $firebaseObject(ref);
      user.username = $scope.newuser.username;
      user.$save();
      return $scope.authObj.$authWithPassword({
        email: $scope.newuser.email,
        password: $scope.newuser.password
      });
    })
    .then(function(authData) {
      $rootScope.loggedIn = true;
      $location.path('/feed')
    })
    .catch(function(error) {
      console.error("Error: ", error);
    });
  };
  
  $rootScope.logIn = function() {
    $scope.authObj.$authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(authData) {
      $location.path('/feed');
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  }
  
});