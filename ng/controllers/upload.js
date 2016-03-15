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