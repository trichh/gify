var gifyApp = angular.module('gifyApp', ['ngRoute', 'ngAnimate', 'firebase', 'ui.bootstrap', 'cloudinary', 'ngFileUpload'])
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
    .when('/upload', {
      templateUrl: 'views/upload.html',
      controller: 'UploadCtrl'
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

      var images = new Firebase("https://gify.firebaseio.com/images/"+uid+"/posts/"); //Get feed of user's posts
      var imgArray = $firebaseArray(images); // asign it to an Firebase Array.
      var post = imgArray;
      console.log(post);
      
      imgArray.$loaded().then(function() {
        //loads the array from Firebase
        // reads image from Firebase
        $scope.images = imgArray;
        var post = $scope.images[0]
        $scope.removePost = function(post) {
          console.log('REMOVE', post);
          imgArray.$remove(post).then(function(images) {
            images.key() === post.$id; // true
          });
        }
      });
      
      

    } else {
      $rootScope.loggedIn = false;
      $location.path('/');
    };// end IF
    
  });// ends $onAuth
  
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
angular.module('gifyApp')
.controller('UploadCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$location', '$routeParams', 'Upload', 'cloudinary', function($scope, $rootScope, $firebaseAuth, $firebaseArray, $firebaseObject, $location, $routeParams, $upload, cloudinary) {
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
      
      $rootScope.show = true;
      
      $scope.uploadFiles = function(files){
        $rootScope.show = false;
        $scope.files = files;
        if (!$scope.files) return;
        angular.forEach(files, function(file){
          if (file && !file.$error) {
            file.upload = $upload.upload({
              url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
              data: {
                upload_preset: cloudinary.config().upload_preset,
                tags: 'myphotoalbum',
                file: file
              }
            }).success(function (data, status, headers, config, authData, userData) {
              var imageUrl = data.url;
              $rootScope.loggedIn = true;
              $location.path('/feed')
              var ref = new Firebase("https://gify.firebaseio.com/images/"+uid+"/posts/");
              var image = $firebaseArray(ref);
              var newImage = new Object();
              newImage.photo = imageUrl;
              newImage.likes = 0;
              image.$add(newImage);
              console.log(newImage);
            })
            .error(function (data, status, headers, config) {
              file.result = data;
            });
          }
        });
      };

    } else {
      $rootScope.loggedIn = false;
      $location.path('/');
    }
  });
  
}]);