angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $http, $timeout, $cordovaToast, $localstorage) {
    $scope.loginData = {};
    $scope.noLogin = true;
    if ($localstorage.get('username')) {
      $scope.loginData.username = $localstorage.get('username');
    }

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.logout = function () {
      $scope.noLogin = true;
      $localstorage.remove('token');
    };

    $scope.doLogin = function () {
      var username = $scope.loginData.username;
      var password = $scope.loginData.password;

      $http({
        method: 'POST',
        url: 'https://www.phodal.com/api-token-auth/',
        data: {
          username: username,
          password: password
        },
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'phodal/2.0 (iOS 8.1, Android 4.4)'
        }
      }).success(function (response) {
        console.log('token' + response.token);
        $scope.noLogin = false;
        $localstorage.set('token', response.token);
        $localstorage.set('username', username);

        $cordovaToast
          .show('Login Success', 'long', 'center')
          .then(function (success) {
            $scope.closeLogin();
          }, function (error) {
            // error
          });
      }).error(function (data, status) {
        console.log('data, status', data, status)
      })
    };
  })


  .controller('ArticleListsCtrl', function ($scope, Blog) {
    $scope.articles = null;
    $scope.blogOffset = 0;

    $scope.doRefresh = function () {
      Blog.async('http://deploy.baimizhou.net/api/blog/articles.json').then(function (results) {
        $scope.articles = results;
      });
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply()
    };

    Blog.async('http://deploy.baimizhou.net/api/blog/articles.json').then(function (results) {
      $scope.articles = results;
    });
  })


  .controller('SearchCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.query = "";
  })


  .controller('ArticleCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.article = {};
    Blog.async('http://deploy.baimizhou.net/api/' + $stateParams.slug + '.json').then(function (results) {
      $scope.article = results;
      $scope.htmlContent = $sce.trustAsHtml($scope.article.articleHTML);
    });

  });
