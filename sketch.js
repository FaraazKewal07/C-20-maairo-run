//creating variables
var PLAY = 1;
 var END = 0;
var gameState = PLAY;

var mairo, mairo_running , mairo_collided;
var pathImg,path,invisiblePath ;


var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle;
var backgroundImg;
var score = 0;
var jumpSound,collidedSound;

var gameOver, gameOverImg ;
 var restartImg,restart;


function preload(){
backgroundImg = loadImage("background.png");

mairo_running = loadAnimation ("mairo 1.png","mairo 2.png","mairo 3.png");
mairo_collided = loadAnimation ("mairo 4.png");

pathImg = loadImage ("path.png");

obstacle1 = loadImage("obstacle 1.png");
obstacle2 = loadImage("obstacle 2.png");
obstacle3 = loadImage("obstacle 3.png");

gameOverImg = loadImage ("gameOver.png");
restartImg = loadImage ("restart.png");

jumpSound = loadSound("jump.wav");
collidedSound = loadSound("collided.wav");

}

function setup() { 

    createCanvas(windowWidth,windowHeight);

    mairo = createSprite(300,height-150,20,20);

    mairo.addAnimation("running", mairo_running);
    mairo.addAnimation("collided", mairo_collided);
    mairo.setCollider('circle',0,0,150);
    mairo.scale = 0.200;


    invisiblePath = createSprite(width/2,height-10,width,125);  

    path = createSprite(width/2,height,width,2);
    path.addImage("path",pathImg);
    path.x = width/2
    path.velocityX = -(6 + 3*score/100);

    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;
  
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup = new Group();
    
    score = 0;
}
    function draw() {
    background(backgroundImg);
    textSize(20);
    fill("black")
    text("Score: "+ score,30,50);
    
    
    if (gameState===PLAY){
      score = score + Math.round(getFrameRate()/60);
      path.velocityX = -(6 + 3*score/100);
      
      if((touches.length > 0 || keyDown("SPACE")) && mairo.y  >= height-120) {
        jumpSound.play();
        mairo.velocityY = -10;
        
      }
      
      mairo.velocityY = mairo.velocityY + 0.8
    
      if (path.x < 0){
        path.x = path.width/2;
      }
    
      mairo.collide(invisiblePath);
      
      spawnObstacles();
    
      if(obstaclesGroup.isTouching(mairo)){
          collidedSound.play()
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      
      //set velcity of each game object to 0
      path.velocityX = 0;
      mairo.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
    
      
      //change the trex animation
      mairo.changeAnimation("collided",mairo_collided);
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
     
      
      if(touches.length>0 || keyDown("SPACE")) {      
        reset();
      
      }
    }
    
    
    drawSprites();
  }



  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,height-95,20,30);
      obstacle.setCollider('circle',0,0,45)
     
    
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        default: break;
      }
      
      //assigning scale and lifetime to the obstacle           
      obstacle.scale = 0.3;
      obstacle.lifetime = 300;
      obstacle.depth = mairo.depth;
      mairo.depth +=1;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    
    
    mairo.changeAnimation("running",mairo_running);
    
    score = 0;
    
  }

 
