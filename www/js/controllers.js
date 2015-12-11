angular.module('starter.controllers', [])

  .controller('AppCtrl', function () {

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
      var github = new Github({
        username: 'fayrobot',
        password: '',
        auth: "basic"
      });
      var options = {
        author: {name: 'fayrobot', email: 'robot@phodal.com'},
        committer: {name: 'fayrobot', email: 'robot@phodal.com'},
        encode: true
      };
      var repo = github.getRepo('fayrobot', 'test');

      var postData = {
        title: $scope.posts.title,
        content: $scope.posts.content,
        url: $scope.posts.slug,
        publish_date: $scope.posts.publish_date,
        author: $localstorage.get('username') || ""
      };
      var stringifyData = JSON.stringify(postData);

      repo.write('master', 'content/' + postData.url + '.json', stringifyData, 'Robot: add article ' + postData.title, options, function (err, data) {
        var createError = err;
        repo.read('master', 'content/' + postData.url + '.json', function(err, data) {
          if(err) {
            alert(createError);
          } else {
            alert("Publish Success");
          }
        });
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
