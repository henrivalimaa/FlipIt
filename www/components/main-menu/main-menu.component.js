'use strict';

angular.module('sample.components.mainMenu', ['sample.components.profileMenu'])
.component('mainMenu', {
  bindings: {
  	gameMenu: '<'
  },
  templateUrl: 'components/main-menu/main-menu.template.html',
  controller: MainMenuController
});

MainMenuController.$inject = [
	'$http',
	'$scope',
	'$state',
	'$rootScope'
];

function MainMenuController($http, $scope, $state, $rootScope) {
	var ctrl = this;
	ctrl.signInWithGoogle = signInWithGoogle;
	ctrl.signOut = signOut;
	ctrl.menuOpen = false;

	ctrl.$onInit = function () {}

	/**
	 * [description]
	 */
	$scope.$watch(function () {
    	return $state.$current.name;
	}, function(state, fromState){
		if (state === 'home') ctrl.menuOpen = true;
		else ctrl.menuOpen = false;
		ctrl.state = state;
	})

	/**
	 * [signInWithGoogle description]
	 * @return {[type]} [description]
	 */
	function signInWithGoogle() {
		var config = { 
			client_id: '369113424971-djka7ikr57l3pbn3d63babsgd4tj5mud.apps.googleusercontent.com', 
			immediate: true, 
			scope: 'https://www.googleapis.com/auth/games',
			// prompt: 'consent'
		}

		gapi.auth.authorize(config, _signinCallback);

		/**
		 * [_signinCallback description]
		 * @param  {[type]} auth [description]
		 * @return {[type]}      [description]
		 */
		function _signinCallback (auth) {
		  if (auth && auth.error == null) {
			console.log(auth);
		    _loadClient();
		  } else {
		    if (auth && auth.hasOwnProperty('error')) {
		      console.log('Login failed because: ', auth.error);
		    }
		  }

		  /**
		   * [_loadClient description]
		   * @return {[type]} [description]
		   */
		  function _loadClient() {
		    gapi.client.load('games','v1',function (response) {
		      	var request = gapi.client.games.players.get({playerId: 'me'})
				request.execute(function(response) {
					ctrl.displayName = response.displayName;
					$scope.$apply();
				});
		    });

		  	gapi.client.load('plus','v1', function () {
		  		var request = gapi.client.plus.people.get({
		  			userId: 'me'
		  		});

		  		request.execute(function(response) {
		        	ctrl.userAuthenticated = true;
		        	ctrl.user = response;
		        	$state.reload();
		        	$scope.$apply();
		  		});
		  	});
		  	
		  }
		}
	}

	function signOut() {
	}
}