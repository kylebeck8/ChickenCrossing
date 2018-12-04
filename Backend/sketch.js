var xCor = 50;
var yCor;
var driveUp;
var driveDown;
var cars = [];
var chicken;
var scoreElem;

function preload() {
  chicken = loadImage('assets/chicken.jpg');
  car_down = loadImage('assets/car_down.png');
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

  for(var i = 0; i < 30; i++) {
    cars.push(new Driver(i));
  }
}

function draw() {
  // put drawing code here
  background(0);
  //image(background, 0, 0);
  image(chicken, xCor, yCor);
  drawSprites();

  for (var i=0; i<cars.length; i++) {
    cars[i].move();
    cars[i].display();
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
    image(car_down, this.x, this.y);
  };
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
      xCor -= 50;
      break;
    case 68: //right
      xCor += 50;
      break;
    case 83: //up
      yCor += 50;
      break;
    case 87: //down
      yCor -= 50;
      break;
  }
  return false;
}
