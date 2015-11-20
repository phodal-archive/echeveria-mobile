angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('ArticleListsCtrl', function($scope, Blog) {
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

.controller('ArticleCtrl', function($scope, $stateParams, $sanitize, $sce, Blog) {
  $scope.article = {};
  Blog.async('http://deploy.baimizhou.net/api/' + $stateParams.slug + '.json').then(function (results) {
    $scope.article = results;
    $scope.htmlContent = $sce.trustAsHtml($scope.article.articleHTML);
  });

});
