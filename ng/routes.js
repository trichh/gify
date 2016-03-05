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
    .otherwise('/');
})