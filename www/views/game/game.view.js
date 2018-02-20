'use strict';

angular.module('flipIt.views.game', ['flipIt.components.game'])
.component('gameView', {
  bindings: {
  	user: '<'
  },
  templateUrl: 'views/game/game.view.html',
  controller: GameViewController
})

GameViewController.$inject = [];

function GameViewController() {
	var ctrl = this;

	ctrl.level;

	ctrl.startGame = startGame;

	ctrl.$onInit = function () {
		ctrl.gameMode = false;
		ctrl.levels = levels;
	}

	function startGame(level) {
		ctrl.gameMode = true;
		ctrl.level = level;
	}
};