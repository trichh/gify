angular.module('gifyApp')
.config(function($routeProvider, $locationProvider) {
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
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    })
    .otherwise('/');
})