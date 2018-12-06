var xCor;
var yCor;
var driveUp;
var driveDown;
var cars = [];

var chicken;
var scoreElem;
var maxScore;
var collision;
var input;
var button;
var prompt;
var cameraSpeed = 0;

var widthElement;
var mapXPos;

//0 is road, 1 is grass
var gameMap;
//0 is up, 1 is down. Is in sync with cars[]
var direction = [];

const url = "http://10.186.135.169:8080/records";

function preload() {
  chickenPic = loadImage('assets/chicken.png');
  carDownPic = loadImage('assets/car_down.png');
  carUpPic = loadImage('assets/car_up.png');
  roadPic = loadImage('assets/road.png');
  grassPic = loadImage('assets/grass.jpg');
  truckUpPic = loadImage('assets/truck_up.png');
  truckDownPic = loadImage('assets/truck_down.png');
}

function setup() {
  // put setup code here
  createCanvas(screen.width, 700);

  chicken = createSprite(xCor, yCor);
  chicken.addImage(chickenPic);

  reset();

  SpawnFirstCars();

  drawSprites();
}

function draw() {
  // put drawing code here
  background(0);

  //add roads and cars
  if ((camera.position.x + width) > mapXPos) {
    for (var i=0; i<2; i++) {
      var tile = int(random(1,11))
      if (gameMap[gameMap.length - 1] == 1) {
        gameMap.push(0);
        AddCars();
      } else if (checkLastThreeSpaces()) {
        gameMap.push(1);
      } else if (tile < 4) {
        gameMap.push(1);
      } else {
        gameMap.push(0);
        AddCars();
      }
      mapXPos += widthElement;
    }
  }

  //display map
  for (var i=0; i<gameMap.length; i++) {
    if (gameMap[i] == 0) {
      DisplayMapElement(0, widthElement * i);
    } else if (gameMap[i] == 1) {
      DisplayMapElement(1, widthElement * i);
    }
  }

  drawSprites();

  camera.position.x += 0.5 + cameraSpeed;
  if (camera.position.x % 200 == 0) {
    cameraSpeed += 0.25
  }

  //moves cars
  for (var i=0; i<cars.length; i++) {
    if(direction[i] == 0) {
      cars[i].velocity.y = -2;
    }
    else {
      cars[i].velocity.y = 2;
    }

    if(direction[i] == 0 && cars[i].position.y < -120) {
      cars[i].position.y = height+60;
    }
    else if(cars[i].position.x % 100 != 0 && cars[i].position.y > height + 60) {
      cars[i].position.y = -120;
    }

    //check collisions
    if(chicken.overlap(cars[i]) || chicken.position.x < camera.position.x - screen.width / 2) {
      noLoop();
      background(0);
      var scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);

      input = createInput();
      input.position(width / 2 - input.width / 2, height / 2);

      button = createButton('submit');
      button.position(input.x + input.width, height / 2);
      button.mousePressed(sendScore);

      prompt = createElement('h2', 'what is your name?')
      prompt.style('color', 'white');
      prompt.position(width / 2 - input.width / 2, height / 2 - 60);

      textAlign(CENTER);
      textSize(50);

      collision = true;
    }
  }

  //check score
  if(chicken.position.x > maxScore && !collision) {
    maxScore = chicken.position.x - 40;
    scoreElem.html('Score = ' + maxScore / (widthElement / 2));
  }
}

function checkLastThreeSpaces() {
  if ((gameMap[gameMap.length - 1] == 0) && (gameMap[gameMap.length - 2] == 0)
        && (gameMap[gameMap.length - 3] == 0))
  {
    return true;
  } else {
    return false;
  }
}

function AddCars() {
  //first section
  var amount = floor(random(0, 4));
  var carType = floor(random(0, 2));
  var directionTemp = floor(random(0, 2));
  var yOffset = 0;
  for (var i=0; i<amount; i++) {
    direction.push(directionTemp);
    cars.push(new Driver(cars.length, mapXPos+widthElement/4));
    cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y + yOffset);
    if (carType == 0) {
      yOffset += 225;
    } else {
      yOffset += 150;
    }
    if (direction[direction.length-1] == 0) {
      if (carType == 0) {
        cars[cars.length-1].addImage(truckUpPic);
      } else {
        cars[cars.length-1].addImage(carUpPic);
      }
    } else {
      if (carType == 0) {
        cars[cars.length-1].addImage(truckDownPic);
      } else {
        cars[cars.length-1].addImage(carDownPic);
      }
    }
  }

  //second section
  amount = floor(random(0, 4));
  carType = floor(random(0, 2));
  directionTemp = floor(random(0, 2));
  yOffset = 0;
  for (var i=0; i<amount; i++) {
    direction.push(directionTemp);
    cars.push(new Driver(cars.length, mapXPos+widthElement*3/4));
    cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y + yOffset);
    if (carType == 0) {
      yOffset += 225;
    } else {
      yOffset += 150;
    }
    if (direction[direction.length-1] == 0) {
      if (carType == 0) {
        cars[cars.length-1].addImage(truckUpPic);
      } else {
        cars[cars.length-1].addImage(carUpPic);
      }
    } else {
      if (carType == 0) {
        cars[cars.length-1].addImage(truckDownPic);
      } else {
        cars[cars.length-1].addImage(carDownPic);
      }
    }
  }
}

function SpawnFirstCars() {
  //First road
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*9/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*11/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y-150);
  cars[cars.length-1].addImage(carUpPic);

  //Second road
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*17/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carDownPic);
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*17/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y+150);
  cars[cars.length-1].addImage(carDownPic);
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*19/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y+100);
  cars[cars.length-1].addImage(truckDownPic);
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*19/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y+300);
  cars[cars.length-1].addImage(carDownPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*21/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*23/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(truckUpPic);

  //Third road
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*29/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(truckDownPic);
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*29/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y+225);
  cars[cars.length-1].addImage(truckDownPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*33/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(truckUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*33/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y-400);
  cars[cars.length-1].addImage(carUpPic);
  direction.push(1);
  cars.push(new Driver(cars.length, widthElement*35/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carDownPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*37/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y);
  cars[cars.length-1].addImage(carUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*37/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y-150);
  cars[cars.length-1].addImage(carUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*39/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y-150);
  cars[cars.length-1].addImage(truckUpPic);
  direction.push(0);
  cars.push(new Driver(cars.length, widthElement*39/4));
  cars[cars.length-1] = createSprite(cars[cars.length-1].x, cars[cars.length-1].y-375);
  cars[cars.length-1].addImage(truckUpPic);
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
  removeElements();

  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  cameraSpeed = 0;
  maxScore = 0;
  collision = false;
  mapXPos = 0;
  gameMap = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1];

  //here's where I try to make the array empty to reset it
  //cars.splice(0,cars.length);
  //direction.splice(0, direction.length);
  for(var i = 0; i < direction.length; i++) {
    direction.pop();
  }
  for(var i = 0; i < cars.length; i++) {
    cars.pop();
  }

  driveUp = height+60;
  driveDown = -120;
  yCor = height / 2;
  xCor = 40;
  widthElement = roadPic.width/2;
  mapXPos = widthElement * 11;

  chicken.position.x = xCor;
  chicken.position.y = yCor;

  camera.position.x = chicken.position.x + (screen.width / 2 - 100);
  camera.position.y = chicken.position.y;

  drawSprites();
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

  reset();
  loop();
}

function Driver(id, pos) {
  this.x = pos;

  if(direction[direction.length-1] == 0) {
    this.y = driveUp;
  }
  else {
    this.y = driveDown;
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
      chicken.position.y += 64;
      break;
    case 87: //down
      chicken.position.y -= 64;
      break;
  }
  //return false;
}
