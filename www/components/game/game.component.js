'use strict';

angular.module('flipIt.components.game', ['flipIt.components.loader'])
.component('game', {
	bindings: {
	  level: '<'
	},
  	templateUrl: 'components/game/game.template.html',
  	controller: GameController
})

GameController.$inject = [
	'$scope'
]

/**
 * [GameController description]
 * @param {[type]} $scope [description]
 */
function GameController($scope) {
	var ctrl = this;
	
	ctrl.showLeaderboard = showLeaderboard;

	$scope.$watch(function () {
    		return ctrl.level;
		}, 
		function (level) {
			if (ctrl.game !== undefined) ctrl.game.destroy();
			ctrl.game = new Game(level);
		}
	);

	$scope.$watch(function () {
    		return ctrl.game;
		}, 
		function (game) {
			if (ctrl.game.isCleared) {

			}

			if (ctrl.game.isPaused) {
				
			}
		}
	);

	function showLeaderboard() {
		var data = { leaderboardId: 'CgkI356-g80bEAIQBA' };
		window.plugins.playGamesServices.showLeaderboard(data);
	}

	function startGame() {
		ctrl.game.start();
	}

	function resetGame() {
		ctrl.game.restart();
	}

	function stopGame() {
		ctrl.game.stop();
	}
}

/**
// REMOVE THIS WHENEVER POSSIBLE!
// THIS IS USED FOR TESTING PURPOSES ONLY!
$scope.$watch(function () {
	return ctrl.gameStarted;
}, function(gameStarted){
	if(gameStarted && !ctrl.timerOn) {
		ctrl.timerOn = true;
	    var downloadTimer = setInterval(function(){
	    	ctrl.timeleft--;
	    	$scope.$apply(); // THIS NEEDS TO BE FIXED

		    if(ctrl.timeleft <= 0) {
		    	ctrl.showResult = true;
		    	ctrl.loadingResult = true;
		    	//ctrl.leaderboardResult = {}; // TESTING
		    	//ctrl.leaderboardResult.formattedScore = 13; // TESTING
		    	//ctrl.leaderboardResult.newBest = false; // TESTING
		    	ctrl.game.input.onUp.removeAll(); // DISABLES BOTTLE'S ACTIONS
		    	$scope.$apply(); // REMOVE WHENEVER POSSIBLE
				
				if (ctrl.score > 7) {
					var achievement = {
						achievementId: 'CgkI356-g80bEAIQAg'
					};

					window.plugins.playGamesServices.unlockAchievement(achievement);
				}

				if (ctrl.score > 0) {

					var result = {
			    		score: ctrl.score,
			    		leaderboardId: 'CgkI356-g80bEAIQBA'
					};

					window.plugins.playGamesServices.submitScoreNow(result, function(response) {
						ctrl.leaderboardResult = response;
						ctrl.loadingResult = false;
						// alert(JSON.stringify(response, null, 4));

						setTimeout(function(response) {
							$scope.$apply();
						}, 10); 
					});
				} else {
					ctrl.loadingResult = false;
					$scope.$apply();
				}
		    	
		    	clearInterval(downloadTimer);
		    }
	    }, 1000);
	}
});
 */