angular.module('gifyApp')
.controller('FeedCtrl', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $location) {
  var ref = new Firebase("https://gify.firebaseio.com");
  $rootScope.authObj = $firebaseAuth(ref);
  $rootScope.loggedIn = true;
  
  $rootScope.authObj.$onAuth(function(authData) {
  if (authData) {
    $rootScope.loggedIn = true;
    console.log("Logged in as:", authData.uid);
    console.log("Open:", $scope.loggedIn);
    
  } else {
    console.log("Logged out");
    $rootScope.loggedIn = false;
    $location.path('/');
  }
});
});