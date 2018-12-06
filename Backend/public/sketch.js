var xCor = 42;
var yCor;
var driveUp;
var driveDown;
var cars = [];
var gameMap = [0, 0, 9, 0, 9, 9, 0, 9, 9, 9, 0];
var chicken;
var scoreElem;
var maxScore;

var input;
var button;
var prompt;

var widthElement;
var mapXPos = 0;

const url = "http://10.186.135.169:8080/records";

function preload() {
  chickenPic = loadImage('assets/chicken.jpg');
  carDownPic = loadImage('assets/car_down.png');
  carUpPic = loadImage('assets/car_up.png');
  roadPic = loadImage('assets/road.png');
  grassPic = loadImage('assets/grass.jpg');
}

function setup() {
  // put setup code here
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');
  maxScore = 1;

  createCanvas(screen.width, 700);
  driveUp = height;
  driveDown = -90;
  yCor = height / 2;
  widthElement = roadPic.width/2;
  mapXPos = widthElement * 11;

  chicken = createSprite(xCor, yCor);
  chicken.addImage(chickenPic);

  for(var i = 0; i < 30; i++) {
    cars.push(new Driver(i));
    cars[i] = createSprite(cars[i].x, cars[i].y);
    if(cars[i].position.x % 100 == 0) {
      cars[i].addImage(carUpPic);
    }
    else {
      cars[i].addImage(carDownPic);
    }

  }

  camera.position.x = chicken.position.x + 250;
  camera.position.y = chicken.position.y;

  drawSprites();
}

function draw() {
  // put drawing code here
  background(0);

  //add roads
  if ((camera.position.x + width) > mapXPos) {
    //console.log(camera.position.x);
    //console.log(width);
    //console.log(mapXPos);
    for (var i=0; i<2; i++) {
      gameMap.push(int(random(1,11)));
      mapXPos += widthElement;
    }
  }
  //display map
  for (var i=0; i<gameMap.length; i++) {
    if (gameMap[i] > 4 || ((i > 1) && gameMap[i - 1] < 5)) {
      DisplayMapElement(0, widthElement * i);
      //spawn car on road
    } else {
      DisplayMapElement(1, widthElement * i);
    }
  }

  drawSprites();

  camera.position.x += 1 /*chicken.position.x + 250*/;

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
    if(chicken.overlap(cars[i]) || chicken.position.x < camera.position.x - 350) {
      noLoop();
      var scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);

      input = createInput();
      input.position(camera.position.x, camera.position.y);

      button = createButton('submit');
      button.position(input.x + input.width, camera.position.y);
      button.mousePressed(sendScore);

      prompt = createElement('h2', 'what is your name?')
      prompt.style('color', 'white');
      prompt.position(camera.position.x, camera.position.y - 60);

      textAlign(CENTER);
      textSize(50);
    }
  }

  //check score
  if(chicken.position.x > maxScore) {
    maxScore = chicken.position.x - 42;
    scoreElem.html('Score = ' + maxScore / (widthElement / 2));
  }
}

function DisplayMapElement(element, location) {
  //0 is road, 1 is grass, 2 is other
  switch (element) {
    case 0:
      image(roadPic, location, 0, widthElement, roadPic.height/2);
      image(roadPic, location, roadPic.height/2, widthElement, roadPic.height/2);
      image(roadPic, location, roadPic.height, widthElement, roadPic.height/2);
      break;
    case 1:
      image(grassPic, location, 0, widthElement, grassPic.height/2);
      image(grassPic, location, grassPic.height/2, widthElement, grassPic.height/2);
      image(grassPic, location, grassPic.height, widthElement, grassPic.height/2);
      break;
  }
}

function reset() {
  // put setup code here

}

function sendScore() {
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(out) {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Info sent");
      }
    };

  var name = input.value();
  const record = {
    name: name,
    score: maxScore
  };

  xhttp.open("POST", "/records");
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(record));
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
      chicken.position.x -= widthElement/2;
      break;
    case 68: //right
      chicken.position.x += widthElement/2;
      break;
    case 83: //up
      chicken.position.y += widthElement/2;
      break;
    case 87: //down
      chicken.position.y -= widthElement/2;
      break;
  }
  //return false;
}
