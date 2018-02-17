'use strict';

angular.module('flipIt.components.game', ['flipIt.components.loader'])
.component('game', {
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
	var clientWidth = window.innerWidth;
	var clientHeight = window.innerHeight;

	ctrl.bottle;
	//ctrl.game = new Phaser.Game(clientWidth = window.innerWidth, clientHeight = window.innerHeight, Phaser.CANVAS, 'game-area', { preload: preload, create: create, update: update, render: render });

	ctrl.restartGame = restartGame;
	ctrl.showLeaderboard = showLeaderboard;

	ctrl.$onInit = function () {
		ctrl.game = new Game();
		ctrl.game.create();
	}

	/**
	 * [preload description]
	 * @return {[type]} [description]
	 */
	/*function preload() {
		ctrl.game.load.image('bottle', 'assets/images/game/bottles/default-bottle.png');
		ctrl.game.load.image('floor', 'assets/images/game/objects/rectangle.png');
		ctrl.game.load.image('grid', 'assets/images/game/backgrounds/grid.png');
	}

	/**
	 * [create description]
	 * @return {[type]} [description]
	 */

	function create() {
		initGame();
	}

	function launch() {} // NOT NEEDED
	
	/**
	 * [update description]
	 * @return {[type]} [description]
	 */
	function update() {
		if(ctrl.gameStarted) {
			if (Math.floor(ctrl.bottle.body.velocity.y) === 0 && !ctrl.calculatingResult) {
				ctrl.calculatingResult = true;
				if (-5 < ctrl.bottle.angle < 5) {
					ctrl.score = ctrl.score + 1;
					$scope.$apply();
				}
			}
		}
	}

	/**
	 * [render description]
	 * @return {[type]} [description]
	 */
	function render() {
		var zone = ctrl.game.camera.deadzone;
	    ctrl.game.context.fillStyle = 'rgba(255,0,0,0.6)';
	    ctrl.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
		ctrl.game.debug.pointer(ctrl.game.input.pointer1);
		// ctrl.game.debug.cameraInfo(ctrl.game.camera, 32, 32);
	}

	function initGame() {
		ctrl.score = 0;
		ctrl.timeleft = 10; // REMOVE THIS WHENEVER POSSIBLE
		ctrl.timerOn = false; // REMOVE THIS WHENEVER POSSIBLE
		ctrl.gameStarted = false;
		ctrl.showResult = false; // REMOVE THIS WHENEVER POSSIBLE
		ctrl.calculatingResult = false;
		ctrl.bottleStationary = true;

		if (ctrl.bottle !== undefined) ctrl.bottle.destroy();

		ctrl.floorCollisionGroup;
		ctrl.bottleCollisionGroup;

		ctrl.game.physics.startSystem(Phaser.Physics.P2JS);
		ctrl.game.add.tileSprite(0, 0, 1920, 1920, 'grid');
		ctrl.game.stage.backgroundColor = '#336590';

		ctrl.game.physics.p2.gravity.y = 1000;
	    ctrl.game.physics.p2.restitution = 0.2;
	    ctrl.game.physics.p2.setImpactEvents(true);

		// THIS NEEDS TO BE FIXED
		setTimeout(function(){ ctrl.game.input.onUp.add(_touchEnd, this); }, 1000);
		
		ctrl.game.world.setBounds(0, 0, clientWidth * 2, clientHeight * 2);
		_createCollisionGroups();
			
		_addFloor();
		_addBottle();

		ctrl.game.camera.follow(ctrl.bottle);
		ctrl.game.camera.deadzone = new Phaser.Rectangle(100, clientHeight / 3, clientWidth - 200, clientHeight / 2 - 100);

		$scope.$apply(); // REMOVE WHENEVER POSSIBLE

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
				    	
				    	/*
				    	setTimeout(function() {
				    		// ctrl.loadingResult = false;
				    		$scope.$apply();
				    	}, 2000);
				    	*/
						
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

		/**
		 * [_flipBottle description]
		 * @return {[type]} [description]
		 */
		function _flipBottle(touch) {
			var distance = touch.positionDown.distance(touch.position, true);
			var duration = touch.duration;
			var angle = ctrl.game.math.angleBetweenPoints(touch.positionDown, touch.position);
			angle = angle;
			angle = ctrl.game.math.roundTo(ctrl.game.math.radToDeg(angle));
			angle = angle + 90;
			ctrl.gameStarted = true;
			if (distance > 50 && touch.positionDown.y > touch.position.y && ctrl.bottleStationary) {
				ctrl.bottle.body.angularVelocity = 6.5;
				ctrl.bottle.body.velocity.x = (angle) * 10;
				ctrl.bottle.body.velocity.y = -clientHeight * (distance / clientHeight * 2.2);
				ctrl.bottleStationary = false;
				ctrl.calculatingResult = false;
			}
			$scope.$apply();
		}

		/**
		 * [_createCollisionGroups description]
		 * @return {[type]} [description]
		 */
		function _createCollisionGroups() {
			ctrl.floorCollisionGroup = ctrl.game.physics.p2.createCollisionGroup();
		    ctrl.bottleCollisionGroup = ctrl.game.physics.p2.createCollisionGroup();
		    ctrl.game.physics.p2.updateBoundsCollisionGroup();
		}

		/**
		 * [_addFloor description]
		 */
		function _addFloor() {
			//ctrl.floor = ctrl.game.add.sprite(clientWidth / 2, clientHeight - 5, 'floor');
			ctrl.floor = ctrl.game.add.sprite(ctrl.game.world.centerX, ctrl.game.world.centerY  + ctrl.game.world.height / 2, 'floor');
		    ctrl.floor.scale.setTo(1000, 1);
		    ctrl.game.physics.p2.enable(ctrl.floor, true);
		    ctrl.floor.body.setCollisionGroup(ctrl.floorCollisionGroup);
		    ctrl.floor.body.static = true;

		    // Collision enabled with bottle
		    ctrl.floor.body.collides(ctrl.bottleCollisionGroup);
		}


		/**
		 * [_addBottle description]
		 */
		function _addBottle() {
			ctrl.bottle = ctrl.game.add.sprite(ctrl.game.world.centerX, ctrl.game.world.centerY + ctrl.game.world.height / 2 - 80, 'bottle');
			ctrl.bottle.anchor.setTo(0.5);
			ctrl.bottle.scale.setTo(0.2);
			ctrl.game.physics.p2.enable(ctrl.bottle, false);
			ctrl.bottle.body.setCollisionGroup(ctrl.bottleCollisionGroup);
			ctrl.bottle.body.collideWorldBounds = true;
			ctrl.bottle.body.fixedRotation = false;

			ctrl.bottle.body.collides(ctrl.floorCollisionGroup, _bottleLanding, this);

			/**
			 * [_bottleLanding description]
			 * @return {[type]} [description]
			 */
			function _bottleLanding() {
				ctrl.bottleStationary = true;
			}
		}

		/**
		 * [_touchStart description]
		 * @return {[type]} [description]
		 */
		function _touchStart() {
			ctrl.touchStartPoint = ctrl.game.input.pointer1.positionDown;
			//console.log(ctrl.touchStartPoint);
		}

		/**
		 * [_touchEnd description]
		 * @return {[type]} [description]
		 */
		function _touchEnd() {
			var lastTouch = ctrl.game.input.pointer1;
			_flipBottle(lastTouch);
		}
	}

	/**
	 * [restartGame description]
	 * @return {[type]} [description]
	 */
	function restartGame() {
		initGame();
	}

	/**
	 * [showLeaderboard description]
	 * @return {[type]} [description]
	 */
	function showLeaderboard() {
		var data = { leaderboardId: 'CgkI356-g80bEAIQBA' };
		window.plugins.playGamesServices.showLeaderboard(data);
	}
}