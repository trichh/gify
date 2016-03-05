angular.module('gifyApp', ['ngRoute', 'ngAnimate', 'firebase', 'ui.bootstrap'])
angular.module('gifyApp')
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })
    .when('/feed', {
      templateUrl: 'views/feed.html',
      controller: 'FeedCtrl'
    })
    .otherwise('/');
}])
angular.module('gifyApp')
.controller('FeedCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$firebaseArray", "$location", function($scope, $rootScope, $firebaseAuth, $firebaseArray, $location) {
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
}]);
angular.module('gifyApp')
.controller('HomeCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$firebaseArray", "$location", function($scope, $rootScope, $firebaseAuth, $firebaseArray, $location) {
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
  
}]);