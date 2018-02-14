'use strict';

angular.module('flipIt.views.home', [])
.component('homeView', {
  templateUrl: 'views/home/home.view.html',
  controller: HomeViewController
});

HomeViewController.$inject = [];

function HomeViewController() {
	var ctrl = this;
};