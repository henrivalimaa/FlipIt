'use strict';

angular.module('sample.components.game', [])
.component('game', {
  templateUrl: 'components/game/game.template.html',
  controller: GameController
})

GameController.$inject = [
	'$scope'
]

function GameController($scope) {
	var ctrl = this;
	var clientWidth = window.innerWidth;
	var clientHeight = window.innerHeight;

	ctrl.bottle;

	ctrl.game = new Phaser.Game(clientWidth = window.innerWidth, clientHeight = window.innerHeight, Phaser.CANVAS, 'game-area', { preload: preload, create: create, update: update, render: render });

	ctrl.restartGame = restartGame;

	function preload() {
		ctrl.game.load.image('bottle', 'assets/images/default-bottle.png');
		ctrl.game.load.image('floor', 'assets/images/rectangle.png');
		ctrl.game.load.image('grid', 'assets/images/grid.png');
	}

	function create() {
		initGame();
	}

	function launch() {}
	function update() {
		if (Math.floor(ctrl.bottle.body.velocity.y) === 0 && !ctrl.calculatingResult) {
			ctrl.calculatingResult = true;
			if ((-5 < ctrl.bottle.angle < 5) && ctrl.gameStarted) {
				ctrl.count = ctrl.count + 1;
				$scope.$apply();
			}
		}
	}
	function render() {}

	function initGame() {
		_initialize()
		ctrl.count = 0;
		ctrl.gameStarted = false;
		ctrl.calculatingResult = false;
		ctrl.bottleStationary = true;

		ctrl.floorCollisionGroup;
		ctrl.bottleCollisionGroup;

		ctrl.game.physics.startSystem(Phaser.Physics.P2JS);
		ctrl.game.add.tileSprite(0, 0, 1920, 1920, 'grid');
		ctrl.game.stage.backgroundColor = '#336590';

		ctrl.game.physics.p2.gravity.y = 1000;
	    ctrl.game.physics.p2.restitution = 0.2;
	    ctrl.game.physics.p2.setImpactEvents(true);

		//ctrl.game.input.onDown.add(_flipBottle, this);
		//ctrl.game.input.onDown.add(_touchStart, this);

		ctrl.game.input.onUp.add(_touchEnd, this);

		ctrl.game.world.setBounds(0, 0, clientWidth * 2, clientHeight * 2);

		



		_createCollisionGroups();
		_addFloor();
		_addBottle();

		ctrl.game.camera.follow(ctrl.bottle);
		ctrl.game.camera.deadzone = new Phaser.Rectangle(100, clientHeight / 3, clientWidth - 200, clientHeight / 2 - 100);

		/**
		 * [_initialize description]
		 * @return {[type]} [description]
		 */
		function _initialize() {
			ctrl.count = 0;
			ctrl.gameStarted = false;
			if (ctrl.bottle !== undefined) ctrl.bottle.destroy();
		}

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
				/*if(angle > 0) {
					ctrl.bottle.body.angularVelocity = 5;
				} else {
					ctrl.bottle.body.angularVelocity = -5;
				}*/
				ctrl.bottle.body.angularVelocity = 6.5;
				ctrl.bottle.body.velocity.x = (angle) * 10;
				ctrl.bottle.body.velocity.y = -clientHeight * (distance / clientHeight * 2.2);
				ctrl.bottleStationary = false;
				ctrl.calculatingResult = false;
				console.log(ctrl.bottle.body.velocity.y);
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
			//ctrl.bottle = ctrl.game.add.sprite(clientWidth / 2, clientHeight - 80, 'bottle');
			ctrl.bottle = ctrl.game.add.sprite(ctrl.game.world.centerX, ctrl.game.world.centerY + ctrl.game.world.height / 2 - 80, 'bottle');
			ctrl.bottle.anchor.setTo(0.5);
			ctrl.bottle.scale.setTo(0.2);
			ctrl.game.physics.p2.enable(ctrl.bottle, false);
			ctrl.bottle.body.setCollisionGroup(ctrl.bottleCollisionGroup);
			ctrl.bottle.body.collideWorldBounds = true;
			ctrl.bottle.body.fixedRotation = false;

			// Collision enableb with floor
			ctrl.bottle.body.collides(ctrl.floorCollisionGroup, _bottleLanding, this);

			/**
			 * [_bottleLanding description]
			 * @return {[type]} [description]
			 */
			function _bottleLanding() {
				ctrl.bottleStationary = true;

				/*
				var timer = ctrl.game.time.create(ctrl.game, true);
				console.log(timer);
				timer.onComplete.add(function(){
					console.log('Timer runs');
					
				}, this);
				timer.start();
				console.log(timer);
				*/

				/***
				_calculateScore();		
				
				$scope.$apply();

				function _calculateScore() {
					console.log(ctrl.calculatingResult)
					if (ctrl.calculatingResult || !ctrl.gameStarted) return;
					else {
						ctrl.calculatingResult = true;
						setTimeout(function () {
							console.log('haloo')
							if ((-5 < ctrl.bottle.angle < 5) && ctrl.gameStarted) {
								ctrl.count = ctrl.count + 1;
								$scope.$apply();
							}
							console.log(ctrl.bottle.angle);
							ctrl.calculatingResult = false;
						}, 3000)
					}
				}
				*/
			}
		}

		function _touchStart() {
			ctrl.touchStartPoint = ctrl.game.input.pointer1.positionDown;
			//console.log(ctrl.touchStartPoint);
		}

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

	function render() {
		var zone = ctrl.game.camera.deadzone;
	    ctrl.game.context.fillStyle = 'rgba(255,0,0,0.6)';
	    ctrl.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

		ctrl.game.debug.pointer(ctrl.game.input.pointer1);
		ctrl.game.debug.cameraInfo(ctrl.game.camera, 32, 32);
	}
}