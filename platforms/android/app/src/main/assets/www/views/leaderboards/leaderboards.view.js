'use strict';

angular.module('sample.views.leaderboards', [])
.component('leaderboardsView', {
  templateUrl: 'views/leaderboards/leaderboards.view.html',
  controller: LeaderboardsViewController
});

LeaderboardsViewController.$inject = [
	'$scope',
	'$http'
];

function LeaderboardsViewController($scope, $http) {
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
		]};

	ctrl.$onInit = function () {
		ctrl.timeSpan = 'ALL_TIME';		
		ctrl.leaderboards.allTime = ctrl.data;
		console.log(ctrl.leaderboards.allTime.items)

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
		var score = _getRandomArbitrary(90, 100);

		gapi.client.request({
			path: '/games/v1/leaderboards/CgkIy8j_ht8KEAIQAw/scores',
			params: {leaderboardId: 'CgkIy8j_ht8KEAIQAw', score: score},
			method: 'post',
			callback: function(response) {
				console.log(response);

				var config = { 
					leaderboardId: 'CgkIy8j_ht8KEAIQAw', 
					collection: 'PUBLIC',
					timeSpan:'ALL_TIME'
				};

				var request = gapi.client.games.scores.list(config);
				request.execute(function (response) { 
					console.log(response);
				});
			}
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