function Game (config) {
	const CLIENT_WIDTH = window.innerWidth;
	const CLIENT_HEIGHT = window.innerHeight;

	this.score = 0;
	this.timeleft = 10; // REMOVE THIS WHENEVER POSSIBLE
	this.timerOn = false; // REMOVE THIS WHENEVER POSSIBLE
	this.gameStarted = false;
	this.showResult = false; // REMOVE THIS WHENEVER POSSIBLE
	this.calculatingResult = false;
	this.bottleStationary = true;

	//this.bottle;
	var game = new Phaser.Game(
		CLIENT_WIDTH, 
		CLIENT_HEIGHT, 
		Phaser.CANVAS, 
		'game-area',
		{ 
			preload: preload, 
			create: create, 
			update: update, 
			render: render 
		});

	/*this.create = create;
	this.preload = preload;
	this.render = render;
	this.update = update;
	this.restartGame = restartGame;*/
	//setTimeout(function(){ game.input.onUp.add(_touchEnd(), this); }, 2000);
	console.log(game);

	function preload() {
		this.game.load.image('bottle', 'assets/images/game/bottles/default-bottle.png');
		this.game.load.image('floor', 'assets/images/game/objects/rectangle.png');
		this.game.load.image('grid', 'assets/images/game/backgrounds/grid.png');
	}

	function create() {
		// if (this.bottle !== undefined) this.bottle.destroy();
		console.log(game);
		game.physics.startSystem(Phaser.Physics.P2JS);
		this.floorCollisionGroup;
		this.bottleCollisionGroup;

		_createPhysics();
		_createCollisionGroups();		
		_createObjects();
		_createBottle();
		_createCamera();
		//game.input.onUp.add(function(){console.log('KULLI');});

		function _createPhysics () {
			console.log(game);
			console.log(this);
			game.physics.startSystem(Phaser.Physics.P2JS);
			game.add.tileSprite(0, 0, 1920, 1920, 'grid');
			game.stage.backgroundColor = '#336590';

			game.physics.p2.gravity.y = 1000;
	    	game.physics.p2.restitution = 0.2;
	    	game.physics.p2.setImpactEvents(true);

	    	// THIS NEEDS TO BE FIXED
			//setTimeout(function(){ game.input.onUp.add(_touchEnd, this); }, 5000);
			game.input.onUp.add(_touchEnd, game);
			game.world.setBounds(0, 0, CLIENT_WIDTH * 2, CLIENT_HEIGHT * 2);
			//game.input.onUp.add(_touchEnd(), game);
			function _touchEnd() {
				var lastTouch = game.input.pointer1;
				console.log(lastTouch);
				_flipBottle(lastTouch);
			}
			function _flipBottle(touch) {
				var distance = touch.positionDown.distance(touch.position, true);
				var duration = touch.duration;

				var angle = game.math.angleBetweenPoints(touch.positionDown, touch.position);
				angle = game.math.roundTo(game.math.radToDeg(angle));
				angle = angle + 90;
				this.gameStarted = true;
				if (distance > 50 && touch.positionDown.y > touch.position.y && this.bottleStationary) {
					game.bottle.body.angularVelocity = 6.5;
					game.bottle.body.velocity.x = (angle) * 10;
					game.bottle.body.velocity.y = -CLIENT_HEIGHT * (distance / CLIENT_HEIGHT * 2.2);
					this.bottleStationary = false;
					this.calculatingResult = false;
				}
			}
			//game.input.onUp.add(touchEnd(), this);
		}


		function _createCollisionGroups() {
			game.floorCollisionGroup = game.physics.p2.createCollisionGroup();
		    game.bottleCollisionGroup = game.physics.p2.createCollisionGroup();
		    game.physics.p2.updateBoundsCollisionGroup();
		}

		function _createObjects() {
			//this.floor = this.game.add.sprite(CLIENT_WIDTH / 2, CLIENT_HEIGHT - 5, 'floor');
			game.floor = game.add.sprite(game.world.centerX, game.world.centerY  + game.world.height / 2, 'floor');
		    game.floor.scale.setTo(1000, 1);
		    game.physics.p2.enable(game.floor, true);
		    game.floor.body.setCollisionGroup(game.floorCollisionGroup);
		    game.floor.body.static = true;

		    // Collision enabled with bottle
		    game.floor.body.collides(game.bottleCollisionGroup);
		}


		function _createBottle() {
			game.bottle = game.add.sprite(game.world.centerX, game.world.centerY + game.world.height / 2 - 120, 'bottle');
			game.bottle.anchor.setTo(0.5);
			game.bottle.scale.setTo(0.2);
			game.physics.p2.enable(game.bottle, false);
			game.bottle.body.setCollisionGroup(game.bottleCollisionGroup);
			game.bottle.body.collideWorldBounds = true;
			game.bottle.body.fixedRotation = false;

			game.bottle.body.collides(game.floorCollisionGroup, _bottleLanding, this);

			function _bottleLanding() {
				this.bottleStationary = true;
			}
		}

		function _createCamera() {
			game.camera.follow(game.bottle);
			game.camera.deadzone = new Phaser.Rectangle(100, CLIENT_HEIGHT / 3, CLIENT_WIDTH - 200, CLIENT_HEIGHT / 2 - 100);
		}
	}

	//function launch() {} // NOT NEEDED
	
	function update() {
		if(this.gameStarted) {
			if (Math.floor(this.bottle.body.velocity.y) === 0 && !this.calculatingResult) {
				this.calculatingResult = true;
				if (-5 < this.bottle.angle < 5) {
					this.score = this.score + 1;
					$scope.$apply();
				}
			}
		}
	}

	function render() {
		var zone = game.camera.deadzone;
	    game.context.fillStyle = 'rgba(255,0,0,0.6)';
	    game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
		game.debug.pointer(game.input.pointer1);
		game.debug.cameraInfo(this.game.camera, 32, 32);
	}

	function restartGame() {
		// TODO
	}
}