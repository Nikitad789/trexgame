var PLAY = 1;
var END = 0;
var WIN=3
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("d.png","f.png");
  
  trex_collided = loadAnimation("dino3.png");
  // sky=loadImage("sky.PNG")
  
  groundImage = loadImage("bg2.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("cactus.png");
  obstacle1.scale=0.5
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus5.png");
  obstacle6 = loadImage("cactus6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  
}

function setup() {
  createCanvas(displayWidth,displayHeight-120);
  // createCanvas(600, 200);

 
  trex = createSprite(displayWidth/2-250,displayHeight-20,20,30);
  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  
  ground = createSprite(displayWidth/2,displayHeight-100,displayWidth*2,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width ;
  ground.scale=2
  // console.log(ground.x)
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth/2,displayHeight-200);
  //300,100-gameover
  //300,140-restart
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight-140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(displayWidth/3,displayHeight-10,400,10);
  invisibleGround.visible = false;

  camera.position.x=displayWidth/2
  camera.position.y=trex.y
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score,displayWidth-100,displayHeight-150);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 804) {
      trex.velocityY = -20;
    }
    // console.log(ground.x)
  
    trex.velocityY = trex.velocityY + 0.8
  
    // console.log(ground.x)
    if (ground.x <0){
      ground.x = ground.width;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  if(score===100){
    gameState= WIN
    
  }
  if(gameState===WIN){
    console.log("Hi")
    textSize(20)
    fill("black")
    text("You Win!!",displayWidth/2,displayHeight+300)


    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    //600,120
    var cloud = createSprite(displayWidth,displayHeight,40,10);
    cloud.y = Math.round(random(displayHeight-220,displayHeight-180));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 90 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight-40,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}