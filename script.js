//var firstIteration;
var spaceship;
var cursors;
var music;
var platformsDisplacement;
var resolution = [800,600];
var game = new Phaser.Game(resolution[0], resolution[1], Phaser.AUTO, '', { preload: preload, create: create, update: update/*, render: render */});
var worldBound = 5000;
var obstacles;
var obstacleProbability;
var previousCamPositon;
var text;
var score;
var smallestY;
var highestScore;
var currentLevel;

obstacleSize = [50,50]

function preload() {
	//game.load.image('bckgnd','mk_bckgnd.png');
	game.load.image('ground','ground.png');
	game.load.image('spaceship', 'spaceship.png');
	game.load.image('ground_land_here', 'ground_land_here.png');
	game.load.physics('spaceship_collision','spaceshipcollision.json');
	//game.load.audio('music', ['rush.mp3']);
}

function create() {
	currentLevel = 1;
	if (document.cookie=="") {
		document.cookie="highestScore=0; expires=Thu, 12 Mar 2020 12:00:00 UTC";
	}else{
		highestScore = document.cookie.split("=")[1];
	}
  	game.world.setBounds(0, 0, game.width, worldBound);
	platformsDisplacement = 0;
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.gravity.y = 200;
	//var background = game.add.sprite(0, 0, 'bckgnd');
	//background.scale.setTo(2.8,2.8);
	
	platforms = game.add.group();
	platforms.enableBody = true;
	platforms.physicsBodyType = Phaser.Physics.P2JS;
		
	//nivel.body.immovable = true; 
	ground_land_here = platforms.create((game.width/2)-128, 450, 'ground_land_here');
	game.physics.p2.enable(ground_land_here);
	ground_land_here.body.clearShapes();
	ground_land_here.body.loadPolygon("spaceship_collision", "ground_land_here");
	ground_land_here.body.static = true;
	
	var style = { font: "32px Impact", fill: "#ff0044", wordWrap: true, wordWrapWidth: ground_land_here.width, align: "center", backgroundColor: "#ffff00" };
	text = game.add.text(ground_land_here.body.x-ground_land_here.width/2, ground_land_here.body.y-ground_land_here.height/2, "LAND HERE S2", style);
	score = 0;
	text_score = game.add.text(0, 0, "Score: "+Math.floor(score), style);
    	text_score.fixedToCamera = true;
    	text_highestscore = game.add.text(0, 40, "Hi Score: "+Math.floor(highestScore), style);
    	text_highestscore.fixedToCamera = true;
    	text_level = game.add.text(0, 80, "Level: "+currentLevel, style);
    	text_level.fixedToCamera = true;
    
	spaceship = game.add.sprite((game.width/2)-25, worldBound-57, 'spaceship');
	spaceship.anchor.x = 0;
	spaceship.anchor.y = 0;
	game.physics.p2.enable(spaceship, false);
	spaceship.body.clearShapes();
	spaceship.body.loadPolygon("spaceship_collision", "spaceship");
	spaceship.body.angularDamping = 0.1;
	spaceship.body.damping = 0.2;
	//spaceship.body.adjustCenterOfMass();
	
	spaceshipCollisionGroup = game.physics.p2.createCollisionGroup();
	blockCollisionGroup = game.physics.p2.createCollisionGroup();
	landBlockCollisionGroup = game.physics.p2.createCollisionGroup();
	
	spaceship.body.setCollisionGroup(spaceshipCollisionGroup);
	spaceship.body.collides([blockCollisionGroup]);
	ground_land_here.body.setCollisionGroup(blockCollisionGroup);
	ground_land_here.body.collides([spaceshipCollisionGroup]);
	
	cursors = game.input.keyboard.createCursorKeys();
	game.camera.follow(spaceship, Phaser.Camera.FOLLOW_TOPDOWN);
	
	smallestY = worldBound;
	
	obstacleProbability = 0.2;
	createObstacles();
	//firstIteration = true;
	//previousCamPosition = game.camera.y;
	//music = game.add.audio('music');

  	//music.play();
}

function verifyLanding(){
	if((spaceship.body.y <= ground_land_here.body.y) && (spaceship.body.y >= ground_land_here.body.y-spaceship.height) && (spaceship.body.angle <= 0.1 && spaceship.body.angle >= -0.1) && (spaceship.body.velocity.x <= 0.1 && spaceship.body.velocity.y >= -0.1)){
		nextStage();
	}
}

function nextStage(){
	if(score > parseFloat(highestScore))
		document.cookie = "highestScore="+score;
	spaceship.body.x = (game.width/2)-25;
	spaceship.body.y = worldBound-57;
	spaceship.body.velocity.x = 0;
	spaceship.body.velocity.y = 0;
	spaceship.body.angle = 0;
	spaceship.body.angularVelocity = 0;
	smallestY = worldBound;
	obstacleProbability+=0.1;
	platforms.removeAll(true,false);
	ground_land_here = platforms.create((game.width/2)-128, 450, 'ground_land_here');
	game.physics.p2.enable(ground_land_here);
	ground_land_here.body.clearShapes();
	ground_land_here.body.loadPolygon("spaceship_collision", "ground_land_here");
	ground_land_here.body.static = true;
	ground_land_here.body.setCollisionGroup(blockCollisionGroup);
	ground_land_here.body.collides([spaceshipCollisionGroup]);
	currentLevel += 1;
	text_level.text = "Level: "+currentLevel;
	createObstacles();
}

function createObstacles() {
	for(var yCoord = 750 ; yCoord < worldBound - 500 ; yCoord += obstacleSize[1])
	{
		if(Math.random() <= obstacleProbability){
			for(var xCoord = 0 ; xCoord < game.width ; xCoord += obstacleSize[0])
			{
				if(Math.random() <= obstacleProbability/2){
					var obstacle = platforms.create(xCoord+obstacleSize[0]*Math.random(), yCoord+obstacleSize[1]*Math.random(), 'ground');
					game.physics.p2.enable(obstacle);	
					obstacle.body.static = true;
					obstacle.body.clearShapes();
					obstacle.body.loadPolygon("spaceship_collision", "ground");
					obstacle.body.setCollisionGroup(blockCollisionGroup);
					obstacle.body.collides([spaceshipCollisionGroup]);
					xCoord += obstacleSize[0]*2;
				}
			}
			yCoord += obstacleSize[1]*3;
		}
	}
}

function computeScore() {
	if(smallestY > spaceship.body.y)
	{
		if(spaceship.body.y <= worldBound - 200 && spaceship.body.y >= ground_land_here.body.y){
			score += smallestY - spaceship.body.y;
			text_score.text = "Score: "+Math.floor(score);
		}
		
		smallestY = spaceship.body.y;
	}
	
}

/*function resetGamePosition() {
	for(var i = platforms.length-1 ; i >= 0 ; i -= 1)
	{
		console.log(platforms.length);
		if(platforms.getAt(i).y - (worldBound - resolution[1]) >= 0){		
			console.log("DO NOT REMOVE");
			platforms.getAt(i).y = platforms.getAt(i).y - (worldBound - resolution[1]);
		}else{
			console.log("REMOVE");
			platforms.removeChildAt(i);
		}
	}
	
	spaceship.body.y = worldBound - resolution[1] + spaceship.body.y;
	console.log(spaceship.body.y);
}*/

function update() {
	game.physics.p2.updateBoundsCollisionGroup();
	//  Reset the dudes velocity (movement)

	if (cursors.left.isDown)
	{
	//  Move to the left
		spaceship.body.angularVelocity -= 0.3;
	}
	else if (cursors.right.isDown)
	{
	//  Move to the right
		spaceship.body.angularVelocity += 0.3;
	}

	//  Allow the dude to jump if they are touching the ground.
	if (cursors.up.isDown)
	{
		var angle = spaceship.body.angle < 0 ? spaceship.body.angle + 360 : spaceship.body.angle;
		spaceship.body.velocity.x += 20*Math.sin(Math.PI*(angle/180));
		spaceship.body.velocity.y -= 20*Math.cos(Math.PI*(angle/180));
	}
	
	verifyLanding();
	computeScore();
	
	//console.log(game.camera.y);
	/*if(game.camera.y <= 0 && firstIteration == false)
	{
		resetGamePosition();
	}*/
	
	//if(!music.isPlaying)
		//music.play();
	
	//firstIteration = false;			
}

/*function render() {
	game.debug.soundInfo(music, 20, 32);
}*/

