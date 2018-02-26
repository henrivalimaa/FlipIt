'use strict';

const CLIENT_WIDTH = window.innerWidth;
const CLIENT_HEIGHT = window.innerHeight;

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

function GameController($scope) {
	var ctrl = this;

	ctrl.showLeaderboard = showLeaderboard;

	$scope.$watch(function () {
    		return ctrl.level;
		},
		function (level) {
			ctrl.config = level;
			ctrl.bootStates();
		}
	);

	ctrl.game = new Phaser.Game(CLIENT_WIDTH, CLIENT_HEIGHT, Phaser.AUTO, 'game-area');
	ctrl.bootStates = function () {
		ctrl.game.state.add("PreloadGame", ctrl.preloadGame);
		ctrl.game.state.add("PlayGame", ctrl.playGame);
		ctrl.game.state.start("PreloadGame");
	}

	ctrl.preloadGame = function () {};
	ctrl.preloadGame.prototype = {
		preload: function () {
			if (ctrl.config !== undefined) {
				for (var resource in ctrl.config.resources) {
					ctrl.game.load.image(ctrl.config.resources[resource].key, ctrl.config.resources[resource].imagePath);
				}
				ctrl.game.load.image(ctrl.config.background.key, ctrl.config.background.imagePath);
			}
		},
		create: function () {
				ctrl.game.state.start("PlayGame");
		}
	}

	ctrl.playGame = function () {};
	ctrl.playGame.prototype = {
		create: function () {
			ctrl.game.score = 0;
			//ctrl.game.timeleft = 10; // REMOVE WHENEVER POSSIBLE
			//ctrl.game.timerOn = false; // REMOVE WHENEVER POSSIBLE
			ctrl.game.isStarted = false;
			ctrl.game.showResult = false; // REMOVE WHENEVER POSSIBLE
			ctrl.game.calculatingResult = false;

			ctrl.game.time.advancedTiming = true;

			ctrl.game.paused = false;
			ctrl.game.physics.startSystem(Phaser.Physics.P2JS);

			ctrl.game.bottleCollisionGroup = ctrl.game.physics.p2.createCollisionGroup();
			ctrl.game.objectCollisionGroup = ctrl.game.physics.p2.createCollisionGroup();
			ctrl.game.physics.p2.updateBoundsCollisionGroup();

			ctrl.game.physics.startSystem(Phaser.Physics.P2JS);
			ctrl.game.add.tileSprite(0, 0, 1920, 1920, 'background');
			ctrl.game.stage.backgroundColor = '#336590';

			ctrl.game.physics.p2.gravity.y = 1000;
			ctrl.game.physics.p2.restitution = 0.2;
			ctrl.game.physics.p2.setImpactEvents(true);

			ctrl.game.input.onUp.add(this.touchEnd, this);
			ctrl.game.world.setBounds(0, 0, CLIENT_WIDTH * 2, CLIENT_HEIGHT * 2);

			ctrl.game.floor = ctrl.game.add.sprite(ctrl.game.world.centerX, ctrl.game.world.centerY  + ctrl.game.world.height / 2, 'floor');
			ctrl.game.floor.scale.setTo(1000, 1);
			ctrl.game.physics.p2.enable(ctrl.game.floor, true);
			ctrl.game.floor.body.setCollisionGroup(ctrl.game.objectCollisionGroup);
			ctrl.game.floor.body.static = true;

			if (ctrl.config !== undefined) {
				for(var object in ctrl.config.objects) {
					ctrl.game.obj = ctrl.game.add.sprite(
						ctrl.game.world.centerX + ctrl.config.objects[object].position.x,
						ctrl.game.world.centerY + ctrl.config.objects[object].position.y,
						ctrl.config.objects[object].key);
					ctrl.game.obj.scale.setTo(ctrl.config.objects[object].scale);
					if (ctrl.config.objects[object].physics) ctrl.game.physics.p2.enable(ctrl.game.obj, false);
					ctrl.game.obj.body.setCollisionGroup(ctrl.game.objectCollisionGroup);
					ctrl.game.obj.body.static = true;
					if(ctrl.config.objects[object].key === 'star') {
						ctrl.game.obj.body.data.shapes[0].sensor = true;
						ctrl.game.obj.body.collides(ctrl.game.bottleCollisionGroup);
					} else {
						ctrl.game.obj.body.collides([ctrl.game.objectCollisionGroup, ctrl.game.bottleCollisionGroup]);
					}
				}
			}

			ctrl.game.bottle = ctrl.game.add.sprite(ctrl.game.world.centerX, ctrl.game.world.centerY + ctrl.game.world.height / 2 - 150, 'bottle');
			ctrl.game.physics.p2.enable(ctrl.game.bottle, false);
			ctrl.game.bottle.anchor.setTo(0.5);
			ctrl.game.bottle.body.setCollisionGroup(ctrl.game.bottleCollisionGroup);
			ctrl.game.bottle.body.collideWorldBounds = true;
			ctrl.game.bottle.body.fixedRotation = false;
			ctrl.game.bottle.body.collides(ctrl.game.objectCollisionGroup, this.bottleLanding, this);
			ctrl.game.bottle.isStationary = true;
			ctrl.game.bottle.body.onBeginContact.add(this.starHit, this);

			ctrl.game.camera.follow(ctrl.game.bottle);
			ctrl.game.camera.scale.x = 0.5; // TEMPORARY
			ctrl.game.camera.scale.y = 0.5; // TEMPORARY
			ctrl.game.camera.deadzone = new Phaser.Rectangle(100, CLIENT_HEIGHT / 3, CLIENT_WIDTH - 200, CLIENT_HEIGHT / 2 - 100);
		},
		starHit: function (body, bodyB, shapeA, shapeB, equatio) {
			if(!body) return;
			if(body.sprite.key === 'star') {
				var style = { font: "30px Arial", fill: "#fff", align: "center" };
				var text = ctrl.game.add.text(body.sprite.position.x, body.sprite.position.y, 'Awesome!', style);
	    	text.anchor.set(0.5);
	    	text.alpha = 0.1;

				ctrl.game.add.tween(text).to( { alpha: 1 }, 500, "Linear", true);

				body.sprite.kill();
			}
		},
		touchEnd: function () {
			var lastTouch = ctrl.game.input.pointer1;
			this.flipBottle(lastTouch);
		},
		flipBottle: function (touch) {
			var distance = touch.positionDown.distance(touch.position, true);
			var duration = touch.duration;

			var angle = ctrl.game.math.angleBetweenPoints(touch.positionDown, touch.position);
			angle = ctrl.game.math.roundTo(ctrl.game.math.radToDeg(angle));
			angle = angle + 90;
			ctrl.game.isStarted = true;
			if (distance > 50 && touch.positionDown.y > touch.position.y) {
				ctrl.game.bottle.body.angularVelocity = 6.5;
				ctrl.game.bottle.body.velocity.x = (angle) * 10;
				ctrl.game.bottle.body.velocity.y = -CLIENT_HEIGHT * (distance / CLIENT_HEIGHT * 2.2);
				ctrl.game.bottle.isStationary = false;
				ctrl.game.calculatingResult = false;
			}
		},
		bottleLanding: function () {
			ctrl.game.bottle.isStationary = true;
		},
		update: function () {
			if(ctrl.game.isStarted) {
				if (Math.floor(ctrl.game.bottle.body.velocity.y) === 0 && !ctrl.game.calculatingResult) {
					ctrl.game.calculatingResult = true;
					if (-5 < ctrl.game.bottle.angle < 5) {
					 	ctrl.game.score = ctrl.game.score + 1;
						console.log(ctrl.game.score);
						$scope.$apply();
					}
				}
			}
		},
		render: function () {
			// var zone = ctrl.game.camera.deadzone;
			// ctrl.game.context.fillStyle = 'rgba(255,0,0,0.6)';
			// ctrl.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
			ctrl.game.debug.pointer(this.game.input.pointer1);
			ctrl.game.debug.cameraInfo(this.game.camera, 32, 32);
			ctrl.game.debug.text(ctrl.game.time.fps, 2, 14, "#00ff00");
		}
	}

	function showLeaderboard() {
		var data = { leaderboardId: 'CgkI356-g80bEAIQBA' };
		/*window.plugins.playGamesServices.showLeaderboard(data);*/
	}
}

/**
// REMOVE ctrl WHENEVER POSSIBLE!
// ctrl IS USED FOR TESTING PURPOSES ONLY!
$scope.$watch(function () {
	return ctrl.gameStarted;
}, function(gameStarted){
	if(gameStarted && !ctrl.timerOn) {
		ctrl.timerOn = true;
	    var downloadTimer = setInterval(function(){
	    	ctrl.timeleft--;
	    	$scope.$apply(); // ctrl NEEDS TO BE FIXED

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
