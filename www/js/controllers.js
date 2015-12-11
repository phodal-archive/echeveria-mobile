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

      var github = new Github({
        username: username,
        password: password,
        auth: "basic"
      });
      var user = github.getUser();
      user.notifications(function (err) {
        if (err === null) {
          $scope.noLogin = false;
          //$cordovaToast
          //  .show('Login Success', 'long', 'center')
          //  .then(function (success) {
          //    $scope.closeLogin();
          //  }, function (error) {
          //    // error
          //  });
          $scope.closeLogin();
        }
      });
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


  .controller('CreateBlogCtrl', function ($scope, $localstorage, $cordovaToast, $http, $state) {
    $scope.posts = {};
    $scope.alreadyLoadDraft = $localstorage.get('draft') !== undefined;
    $scope.isLocalDraft = function () {
      return $scope.alreadyLoadDraft;
    };

    $scope.load = function () {
      var draft = JSON.parse($localstorage.get('draft'));
      $scope.posts = draft;
      $scope.posts.publish_date = new Date(draft.publish_date);
      $scope.alreadyLoadDraft = false;
    };

    $scope.save = function () {
      var data = serialData($scope.posts);
      $scope.alreadyLoadDraft = true;
      $localstorage.set('draft', JSON.stringify(data));
    };

    $scope.create = function () {
      var token = $localstorage.get('token');
      var data = serialData($scope.posts);

      $http({
        method: 'POST',
        url: 'https://www.phodal.com/api/app/blog/',
        data: data,
        headers: {
          'Authorization': 'JWT ' + token,
          'User-Agent': 'phodal/2.0 (iOS 8.1, Android 4.4)'
        }
      }).success(function (response) {
        if ($localstorage.get('draft')) {
          $localstorage.remove('draft');
        }

        $scope.posts = {};
        $cordovaToast
          .show('Create Success', 'long', 'center')
          .then(function (response) {
            if (data.status === 2) {
              $state.go('app.blog-detail', {slug: response.slug});
            }
          }, function (error) {

          });
      }).error(function (rep, status) {
        if (status === 401) {
          alert(rep.detail);
        }
        alert(JSON.stringify(rep));
        $localstorage.set('draft', JSON.stringify(data));
      });
    }
  })


  .controller('ArticleCtrl', function ($scope, $stateParams, $sanitize, $sce, Blog) {
    $scope.article = {};
    Blog.async('http://deploy.baimizhou.net/api/' + $stateParams.slug + '.json').then(function (results) {
      $scope.article = results;
      $scope.htmlContent = $sce.trustAsHtml($scope.article.articleHTML);
    });

  });
