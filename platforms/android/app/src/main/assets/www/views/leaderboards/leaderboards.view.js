'use strict';

angular.module('flipIt.views.leaderboards', [])
.component('leaderboardsView', {
  templateUrl: 'views/leaderboards/leaderboards.view.html',
  controller: LeaderboardsViewController
});

LeaderboardsViewController.$inject = [
	'$scope',
	'$state'
];

function LeaderboardsViewController($scope, $state) {
	var ctrl = this;
	ctrl.showLeaderboard = showLeaderboard;
	ctrl.generateScore = generateScore;
	ctrl.leaderboards = { allTime: {}, weekly: {}, daily: {}};

	ctrl.data = {
		items: [
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
			{
				formattedScore: 1000,
				player: {
					displayName: 'TBHerns',
					avatarImageUrl: 'https://yt3.ggpht.com/-lGn7AH_RhDo/AAAAAAAAAAI/AAAAAAAAAAA/zBSU238s17Q/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
				}
			},
		]};

	ctrl.$onInit = function () {
		ctrl.timeSpan = 'ALL_TIME';
		ctrl.leaderboards.allTime = ctrl.data;

		/*
		alert(window.plugins);
		window.plugins.playGamesServices.showPlayer(function (playerData) {
			alert(JSON.stringify(playerData, null, 4));
			ctrl.player = playerData.displayName;
		});
		*/

		/**
		window.plugins.playGamesServices.isSignedIn(function (result) {
			alert(response)
			if (response.isSignedIn) {
				window.plugins.playGamesServices.showPlayer(function (playerData) {
					ctrl.dummy = playerData.displayName;
				});
			} else {
				$state.reload();
			}
		});
		*/

		/*
		var config = { 
			leaderboardId: 'CgkIy8j_ht8KEAIQAw', 
			collection: 'PUBLIC',
			timeSpan: ctrl.timeSpan
		};

		var request = gapi.client.games.scores.list(config);
		request.execute(function(response) {
			ctrl.leaderboards.allTime = response;
		});
		*/
	}

	/**
	 * [showLeaderboard description]
	 * @param  {[type]} timeSpan [description]
	 * @return {[type]}             [description]
	 */
	function showLeaderboard(timeSpan) {
		ctrl.timeSpan = timeSpan;
		
		var config = { 
			leaderboardId: 'CgkIy8j_ht8KEAIQAw', 
			collection: 'PUBLIC',
			timeSpan: ctrl.timeSpan
		};

		if (ctrl.timeSpan !== 'ALL_TIME') {
			var request = gapi.client.games.scores.list(config);
			request.execute(function(response) {
				if(ctrl.timeSpan === 'WEEKLY') ctrl.leaderboards.weekly = response;
				if(ctrl.timeSpan === 'DAILY') ctrl.leaderboards.daily = response;
			});
		}
	}

	/**
	 * [generateScore description]
	 * @return {[type]} [description]
	 */
	function generateScore () {
		var score = _getRandomArbitrary(900, 1000);

		var data = {
    		score: score,
    		leaderboardId: 'CgkI356-g80bEAIQBA'
		};

		window.plugins.playGamesServices.submitScoreNow(data, function(response) {
			// alert(JSON.stringify(response, null, 4));
			var data = {
				leaderboardId: 'CgkI356-g80bEAIQBA'
			};
			window.plugins.playGamesServices.showLeaderboard(data);
		});

		/**
		 * [_getRandomArbitrary description]
		 * @param  {[type]} min [description]
		 * @param  {[type]} max [description]
		 * @return {[type]}     [description]
		 */
		function _getRandomArbitrary(min, max) {
		  return Math.floor(Math.random() * (max - min) + min);
		}
	}
};