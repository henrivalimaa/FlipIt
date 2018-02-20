'use strict';

angular.module('flipIt.components.mainMenu', ['flipIt.components.profile'])
.component('mainMenu', {
  templateUrl: 'components/main-menu/main-menu.template.html',
  controller: MainMenuController
});

MainMenuController.$inject = [
	'$scope',
	'$state',
	'$rootScope'
];

function MainMenuController($scope, $state, $rootScope) {
	var ctrl = this;
	ctrl.menuOpen = false;

	ctrl.signOut = signOut;
	ctrl.signInWithGoogle = signInWithGoogle;
	ctrl.showLeaderboard = showLeaderboard;

	ctrl.$onInit = function () {}

	/**
	 * [description]
	 */
	$scope.$watch(function () {
    	return $state.$current.name;
	}, function(state, fromState){
		ctrl.state = state;
	})

	/**
	 * [description]
	 */
	$scope.$watch(function () {
    	return $rootScope.userIsAuthenticated;
	}, function(auth){
		if (auth === true) {
			window.plugins.playGamesServices.showPlayer(function (player) {
				// alert(JSON.stringify(player, null, 4));
				ctrl.player = player;
				ctrl.userAuthenticated = true;
				$scope.$apply();
			});
		}
	})

	/**
	 * [signInWithGoogle description]
	 * @return {[type]} [description]
	 */
	function signInWithGoogle() {
		// window.plugins.playGamesServices.auth();
		window.plugins.playGamesServices.showPlayer(function (player) {
			// alert(JSON.stringify(player, null, 4));
			ctrl.player = player;
			ctrl.userAuthenticated = true;
			$scope.$apply();
		});

	}

	/**
	 * [signOut description]
	 * @return {[type]} [description]
	 */
	function signOut() {
		window.plugins.playGamesServices.signOut();
	}

	function showLeaderboard() {
		var data = { leaderboardId: 'CgkI356-g80bEAIQBA' };
		window.plugins.playGamesServices.showLeaderboard(data);
	}
}