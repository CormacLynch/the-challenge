var app = angular.module('sportDecApp', ['ngRoute','ngAnimate','ngSanitize']);
app.controller('sportsNewsDataController', function($scope, $http) {
	$scope.title = 'Sport news',
	$http.get("/js/data/news-articles-feed.json").then(function(response) {
		$scope.newsFeedData = response.data;
	})
	$http.get("/js/data/single-news-article.json").then(function(response) {
		$scope.newsArticleData = response.data;
	})
	$scope.showFilterNavigation = true;
	$scope.showBackNavigation = false;
	$scope.newsFeedDataFilters = [
		{
			name: 'All'
		},
		{
			name: 'Premier League'
		},
		{
			name: 'Transfer News'
		},
		{
			name: 'UEFA Europa League'
		}
	],
	$scope.scrollPosition = 0,
	$scope.showNewsFor = '',
	$scope.changeShowNewsFor = function(value) {
		$scope.showNewsFor = value.id;
	}
	$scope.newsfilteredBy = '',
	$scope.changeNewsFilteredBy = function(value) {
		$scope.newsfilteredBy = value;
	}
	$scope.orderNewsItems = function(newsItem) {
		var filter = $scope.newsfilteredBy;
		if (filter === 'All') {
			filter = '';
		}
		for (var i = 0; i < newsItem.keywords.length; i++) {
			if(newsItem.keywords[i].keyword === filter) {
				return newsItem;
			}
		}
	};
	$scope.scrollToPosition = function(position) {
		setTimeout(function() {
			window.scrollTo(0, position);
		}, 100);
	}
	$scope.$on('$locationChangeStart', function(event, currentRoute, previousRoute) {
		if (currentRoute.indexOf('news-item') !== -1) {
			$scope.scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
			$scope.scrollToPosition(0)
			$scope.showFilterNavigation = false;
			$scope.showBackNavigation = true;
		} else {
			$scope.scrollToPosition($scope.scrollPosition)
			$scope.showFilterNavigation = true;
			$scope.showBackNavigation = false;
		}
	});
});

app.directive('sportHeader', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/SportHeader.html'
	};
});

app.directive('filterNavigation', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/NewsFilterNavigation.html'
	};
});
app.directive('backNavigation', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/BackNavigation.html'
	};
});

app.directive('burger', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/Burger.html'
	};
});

app.directive('menu', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/Menu.html'
	};
});

app.directive('newsItems', function() {
	return {
		restrict: 'E',
		templateUrl: '../../views/includes/NewsItems.html'
	};
});

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "../../views/templates/NewsFeedPage.html"
	})
	.when("/news-item", {
		templateUrl : "../../views/templates/NewsItemPage.html"
	})
});

