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
.controller('FeedCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$firebaseArray", "$firebaseObject", "$location", function($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $location) {
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
  
}]);
angular.module('gifyApp')
.controller('HomeCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$firebaseArray", "$firebaseObject", "$location", function($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $location) {
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
  
}]);