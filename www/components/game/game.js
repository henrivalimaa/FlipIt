'use strict'
//const CLIENT_WIDTH = window.innerWidth;
//const CLIENT_HEIGHT = window.innerHeight;

function Game (config) {
	this.score = 0;
	this.timeleft = 10; // REMOVE THIS WHENEVER POSSIBLE
	this.timerOn = false; // REMOVE THIS WHENEVER POSSIBLE
	this.gameStarted = false;
	this.showResult = false; // REMOVE THIS WHENEVER POSSIBLE
	this.calculatingResult = false;
	this.bottleStationary = true;

	this.game = new Phaser.Game(CLIENT_WIDTH, CLIENT_HEIGHT, Phaser.AUTO, 'game-area');
	this.bootStates = function () {
		this.game.state.add("PreloadGame", this.preloadGame);
	  this.game.state.add("PlayGame", this.playGame);
		this.game.state.start("PreloadGame");
	}

	this.preloadGame = new PreloadState(this);
	this.playGame = new PlayState(this);

	this.increaseScore = increaseScore;
	function increaseScore () {
		this.score++;
	}
}

function PreloadState (parent) {
	return this.prototype = {
		preload: function () {
			parent.game.load.image('bottle', 'assets/images/game/bottles/default-bottle-scaled.png');
			parent.game.load.image('floor', 'assets/images/game/objects/rectangle.png');
			parent.game.load.image('grid', 'assets/images/game/backgrounds/grid.png');
		},
		create: function () {
				parent.game.state.start("PlayGame");
		}
	}
};

function PlayState (parent) {
	return this.prototype = {
		create: function () {
			ctrl.config.konstaaSattuu(halo);
			parent.game.paused = false;
			parent.game.physics.startSystem(Phaser.Physics.P2JS);

			parent.game.floorCollisionGroup = parent.game.physics.p2.createCollisionGroup();
			parent.game.bottleCollisionGroup = parent.game.physics.p2.createCollisionGroup();
			parent.game.physics.p2.updateBoundsCollisionGroup();

			parent.game.physics.startSystem(Phaser.Physics.P2JS);
			parent.game.add.tileSprite(0, 0, 1920, 1920, 'grid');
			parent.game.stage.backgroundColor = '#336590';

			parent.game.physics.p2.gravity.y = 1000;
			parent.game.physics.p2.restitution = 0.2;
			parent.game.physics.p2.setImpactEvents(true);

			parent.game.input.onUp.add(this.touchEnd, this);
			parent.game.world.setBounds(0, 0, CLIENT_WIDTH * 2, CLIENT_HEIGHT * 2);

			parent.game.floor = parent.game.add.sprite(parent.game.world.centerX, parent.game.world.centerY  + parent.game.world.height / 2, 'floor');
			parent.game.floor.scale.setTo(1000, 1);
			parent.game.physics.p2.enable(parent.game.floor, true);
			parent.game.floor.body.setCollisionGroup(parent.game.floorCollisionGroup);
			parent.game.floor.body.static = true;

			parent.game.bottle = parent.game.add.sprite(parent.game.world.centerX, parent.game.world.centerY + parent.game.world.height / 2 - 150, 'bottle');
			parent.game.physics.p2.enable(parent.game.bottle, true);
			parent.game.bottle.anchor.setTo(0.5);
			parent.game.bottle.body.setCollisionGroup(parent.game.bottleCollisionGroup);
			parent.game.bottle.body.collideWorldBounds = true;
			parent.game.bottle.body.fixedRotation = false;
			parent.game.bottle.body.collides(parent.game.floorCollisionGroup, this.bottleLanding, this);

			parent.game.camera.follow(parent.game.bottle);
			parent.game.camera.deadzone = new Phaser.Rectangle(100, CLIENT_HEIGHT / 3, CLIENT_WIDTH - 200, CLIENT_HEIGHT / 2 - 100);
		},
		touchEnd: function () {
			var lastTouch = parent.game.input.pointer1;
			this.flipBottle(lastTouch);
		},
		flipBottle: function (touch) {
			var distance = touch.positionDown.distance(touch.position, true);
			var duration = touch.duration;

			var angle = parent.game.math.angleBetweenPoints(touch.positionDown, touch.position);
			angle = parent.game.math.roundTo(parent.game.math.radToDeg(angle));
			angle = angle + 90;
			parent.gameStarted = true;
			if (distance > 50 && touch.positionDown.y > touch.position.y) {
				parent.game.bottle.body.angularVelocity = 6.5;
				parent.game.bottle.body.velocity.x = (angle) * 10;
				parent.game.bottle.body.velocity.y = -CLIENT_HEIGHT * (distance / CLIENT_HEIGHT * 2.2);
				parent.bottleStationary = false;
				parent.calculatingResult = false;
			}
		},
		bottleLanding: function () {
			parent.bottleStationary = true;
		},
		update: function () {
			if(parent.gameStarted) {
				if (Math.floor(parent.game.bottle.body.velocity.y) === 0 && !parent.calculatingResult) {
					parent.calculatingResult = true;
					if (-5 < parent.game.bottle.angle < 5) {
					 	// parent.game.score = parent.game.score + 1;
						parent.increaseScore();
					}
				}
			}
		},
		render: function () {
			// var zone = this.game.camera.deadzone;
			// this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
			// this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
			parent.game.debug.pointer(this.game.input.pointer1);
			parent.game.debug.cameraInfo(this.game.camera, 32, 32);
		}
	}
}
