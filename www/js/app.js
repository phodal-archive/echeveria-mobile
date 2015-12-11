// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  //.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  //
  //  var backText = "后退";
  //  $ionicConfigProvider.backButton.previousTitleText(false).text(backText).icon('ion-ios-arrow-back')
  //})

    .config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })


  .state('app.blog-create', {
    url: '/blog/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/create.html',
        controller: 'CreateBlogCtrl'
      }
    }
  })

  .state('app.setting', {
    url: '/setting',
    views: {
      'menuContent': {
        templateUrl: 'templates/setting.html',
        controller: 'SettingCtrl'
      }
    }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('app.article', {
      url: '/article',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists.html',
          controller: 'ArticleListsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/article/:slug',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail.html',
        controller: 'ArticleCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/article');
});
