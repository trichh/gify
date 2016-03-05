angular.module('gifyApp')
.controller('HomeCtrl', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $location) {
  var ref = new Firebase("https://gify.firebaseio.com");
  $rootScope.authObj = $firebaseAuth(ref);
  
  $rootScope.loggedIn = false;
  console.log("What state? ", $scope.loggedIn);
  
  $scope.register = function() {
    $scope.authObj.$createUser({
      email: $scope.newuser.email,
      password: $scope.newuser.password
    })
    .then(function(userData) {
      return $scope.authObj.$authWithPassword({
        email: $scope.newuser.email,
        password: $scope.newuser.password
      });
    })
    .then(function(authData) {
//      console.log("Logged in as:", authData.uid);
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