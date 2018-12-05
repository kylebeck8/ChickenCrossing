var xCor = 50;
var yCor;
var driveUp;
var driveDown;
var cars = [];
var chicken;
var scoreElem;

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
    cars[i].addImage(car_down);
  }

  drawSprites();
}

function draw() {
  // put drawing code here
  background(0);
  //image(background, 0, 0);
  drawSprites();

<<<<<<< HEAD
<<<<<<< HEAD
  camera.position.x += 0.25 /*chicken.position.x + 250*/;
=======
  camera.position.x = chicken.position.x + 250;
>>>>>>> 2a166abcbfcfeb0e0bb29b26ed109e456de13536
=======
  camera.position.x = chicken.position.x + 250;
>>>>>>> 2a166abcbfcfeb0e0bb29b26ed109e456de13536

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
  }
  checkCollision();
}

function Driver(id) {
  var x = floor(random(51, width))
  this.x = x + (50 - (x % 50));

  if(this.x % 100 == 0) {
    this.y = driveUp + (id * 90);
  }
  else {
    this.y = driveDown - (id * 90);
  }

  this.w = 40;
  var type = [50, 90];
  this.h = random(type);
<<<<<<< HEAD
=======

  this.move = function() {
    if(this.x % 100 == 0) {
      this.y -= 1;
      if(this.y < -90) {
        this.y = height;
      }
    }
    else {
      this.y += 1;
      if(this.y > height) {
        this.y = -90;
      }
    }
  };

  this.display = function() {
    if(this.x % 100 == 0) {
      image(carUp, this.x, this.y);
    } else {
      image(carDown, this.x, this.y);
    }
  };
>>>>>>> 2a166abcbfcfeb0e0bb29b26ed109e456de13536
}

function checkCollision() {
  for (var i=0; i<cars.length; i++) {
    if(xCor == cars[i].x && yCor == cars[i].y) {
      xCor = 50;
      yCor = height / 2;
    }
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
