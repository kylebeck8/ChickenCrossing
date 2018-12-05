var xCor = 50;
var yCor;
var driveUp;
var driveDown;
var cars = [];
var chicken;
var scoreElem;
var maxScore = 0;

function preload() {
  chickenPic = loadImage('assets/chicken.jpg');
  carDown = loadImage('assets/car_down.png');
  carUp = loadImage('assets/car_up.png');
  //background = loadImage('assets/background.jpg');
}

function setup() {
  // put setup code here
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  createCanvas(700, 700);
  driveUp = height;
  driveDown = -90;
  yCor = height / 2;

  chicken = createSprite(xCor, yCor);
  chicken.addImage(chickenPic);

  for(var i = 0; i < 30; i++) {
    cars.push(new Driver(i));
    cars[i] = createSprite(cars[i].x, cars[i].y);
    if(cars[i].position.x % 100 == 0) {
      cars[i].addImage(carUp);
    }
    else {
      cars[i].addImage(carDown);
    }

  }

  camera.position.x = chicken.position.x + 250;
  camera.position.y = chicken.position.y;

  drawSprites();
}

function draw() {
  // put drawing code here
  background(0);
  //image(background, 0, 0);
  drawSprites();

  camera.position.x += 0.25 /*chicken.position.x + 250*/;

  //moves cars
  for (var i=0; i<cars.length; i++) {
    if(cars[i].position.x % 100 == 0) {
      cars[i].velocity.y = -2;
    }
    else {
      cars[i].velocity.y = 2;
    }

    if(cars[i].position.x % 100 == 0 && cars[i].position.y < -90) {
      cars[i].position.y = height;
    }
    else if(cars[i].position.x % 100 != 0 && cars[i].position.y > height) {
      cars[i].position.y = -90;
    }

    //check collisions
    if(chicken.overlap(cars[i]) || chicken.position.x < 0) {
      noLoop();
      var scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);
    }
  }

  //check score
  if(chicken.position.x > maxScore) {
    maxScore = chicken.position.x;
    scoreElem.html('Score = ' + maxScore / 50);
  }
}

function Driver(id) {
  var x = floor(random(51, width))
  this.x = x + (50 - (x % 50));

  if(this.x % 100 == 0) {
    this.y = driveUp + (id * 130);
  }
  else {
    this.y = driveDown - (id * 130);
  }
}

function keyPressed() {
  switch (keyCode) {
    case 65: //left
      chicken.position.x -= 50;
      break;
    case 68: //right
      chicken.position.x += 50;
      break;
    case 83: //up
      chicken.position.y += 50;
      break;
    case 87: //down
      chicken.position.y -= 50;
      break;
  }
  return false;
}
