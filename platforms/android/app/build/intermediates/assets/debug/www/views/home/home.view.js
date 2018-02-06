'use strict';

angular.module('sample.views.home', [])
.component('homeView', {
  templateUrl: 'views/home/home.view.html',
  controller: HomeViewController
});

HomeViewController.$inject = [];

function HomeViewController() {
	var ctrl = this;
};

/*
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'views/home/home.view.html',
    controller: HomeViewController
  });
}])
*/