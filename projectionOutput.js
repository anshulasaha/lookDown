let noiseMax = 200;
let phase = 0;
let sensorValue1 = 0; // Default for noiseMax and phase
let sensorValue2 = 0; // Default for background color
let serial;
let latestData = "";
let gridSize = 30; // Size of the grid cells
let mappedValue = 0; // Mapped value for controlling dot brightness
let listOfColors = ["#1c77c3", "#39a9db", "#40bcd8", "#f39237", "#d63230", "#540d6e", "#ee4266", "#ffd23f","#f3fcf0", "#19647E"];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  serial = new p5.WebSerial();

  // Check if WebSerial is supported
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or Edge.");
    noLoop();
    return;
  }

  // Setup WebSerial events
  serial.on("portavailable", () => serial.open());
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
  serial.on("requesterror", portError);

  // Create a button to select the port
  makePortButton();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function serialEvent() {
  let currentString = serial.readLine(); // Reading incoming data
//   console.log("Serial event:", currentString);
 
  //Sensor 1: 1187 cm, Sensor 2: 217 cm


  if (currentString) {
    let values = currentString.match(/\d+/g); // Extracting only numbers
    console.log(values);
    if (values.length >= 4) {
      sensorValue1 = parseFloat(values[1]); // Controls phase + noiseMax
      
      sensorValue2 = parseFloat(values[3]); // Controls background color
      //console.log(sensorValue1, sensorValue2);
    }
  
  }
}

function draw() {
  
//   // Background color based on sensorValue2
//   if (sensorValue2 >= 0 && sensorValue2 <= 14) background(255, 255, 0);
//   else if (sensorValue2 >= 15 && sensorValue2 <= 28) background(0, 255, 0);
//   else if (sensorValue2 >= 29 && sensorValue2 <= 43) background(0, 255, 255);
//   else if (sensorValue2 >= 44 && sensorValue2 <= 55) background(255, 0, 255);
//   else background(255);

  background(255);
  
  mappedValue = map(sensorValue2, 0, 255, 0, 255);

  //if(sensorValue2 <=200)
  drawDots(); //callind draw dots here 
  
  translate(width / 2, height / 2);
  stroke(0);
  noFill();


  //  SENSOR 1 → Controls Phase & NoiseMax** 
   // let phaseMapped = map(sensorValue1, 0, 35, 0.03, 1.5); 
   // let noiseMaxMapped = map(sensorValue1, 36, 55, 0, 100); 
  //phase = constrain(phaseMapped, 0, 2);
  // noiseMax = constrain(noiseMaxMapped, 0, 100);


  // **DRAWING THE SHAPE (Using noiseMax & phase)** 

  //noiseMax = map(sensorValue1, 0, 10, 0, 10);
  
//   if(sensorValue1 >= 36 && sensorValue1 <= 55)
//     {
//       noiseMax = sensorValue1;
//     }
//   else noiseMax = 20;
  
  noiseMax = sensorValue1;
  
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = map(sin(a), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff), 0, 1, 100, 200);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  
  endShape(CLOSE);

  //phase += map(sensorValue1, 0, 10, 0.01, 0.05); 
  
  // if(sensorValue1 >= 0 && sensorValue1 <= 35)
  //   {
  //     phase = sensorValue1/100;
  //   }
  // else noiseMax = 0.04;
  
  phase += sensorValue1/100;
  
}

// **Draw a grid of dots, size controlled by mappedValue**
function drawDots() {
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let dia = map(mappedValue, 0, 255, 2, gridSize); // Adjust dot sizes
      //fill(0); // Black dots
      let randomColor =listOfColors[int(random(listOfColors.length))];
        fill(randomColor);
      noStroke();
      circle(x + gridSize / 2, y + gridSize / 2, dia);
    }
  }
}

// Create a button to select the port
function makePortButton() {
  let button = createButton("Select Port");
  button.position(10, 10);
  button.mousePressed(() => serial.requestPort());
}

// Handle errors
function portError(err) {
  console.error("Serial port error: " + err);
}
