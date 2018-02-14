'use strict';

angular.module('flipIt.components.profile', [])
.component('profile', {
  bindings: {
  	user: '<'
  },
  templateUrl: 'components/profile/profile.template.html',
  controller: ProfileController
});

ProfileController.$inject = [ '$scope' ];

function ProfileController($scope) {
	var ctrl = this;

	ctrl.showAchievements = showAchievements;

	ctrl.$onInit = function () {
		// alert(JSON.stringify(ctrl.user, null, 4));
		
		// setTimeout(function() {alert(JSON.stringify(ctrl.user, null, 4));}, 2000);
		// window.plugins.playGamesServices.showAchievements();
		// $scope.$apply();	
	}

	function showAchievements() {
		window.plugins.playGamesServices.showAchievements();
	}
}