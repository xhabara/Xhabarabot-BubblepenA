let ellipses = [];
let paused = false;
let firstMouseClick = false;
let sound1, sound2;
let currentSound;
let colorPicker;
let resetButton;
let autonomousMode = false;
let lastPoint = null;
let autonomousButton;
let autonomousModeActivated = false;
let soundEffectDropdown;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(155);

  window.addEventListener("keydown", function (e) {
    if (e.key === "s") {
      saveSketch();
    }
  });

  colorPicker = createColorPicker("#FDF8F9");
  colorPicker.position(10, 65);
  colorPicker.style('width', '80px');
  colorPicker.style('height', '40px');
  colorPicker.style('border', 'none');
  colorPicker.style('border-radius', '5px');
  colorPicker.style('padding', '5px');

  resetButton = createButton("Clear Canvas");
  resetButton.position(100, 20);
  resetButton.mousePressed(resetSketch);
  styleButton(resetButton);

  let refreshButton = createButton('Refresh');
  refreshButton.position(10, 20); // Adjust this position to fit your layout
  refreshButton.mousePressed(() => window.location.reload());
  styleButton(refreshButton);
  
  soundEffectDropdown = createSelect();
  soundEffectDropdown.position(100, 70);
  soundEffectDropdown.option('Default', 'default');
  soundEffectDropdown.option('Slow Down', 'slow');
  soundEffectDropdown.option('Speed Up', 'fast');
  soundEffectDropdown.option('Reverse', 'reverse');
  soundEffectDropdown.option('Mixed', 'random');
  soundEffectDropdown.selected('default');
  soundEffectDropdown.style('width', '120px');
  soundEffectDropdown.style('height', '30px');
  soundEffectDropdown.style('background-color', '#FFF');
  soundEffectDropdown.style('border', '1px solid #000');
  soundEffectDropdown.style('border-radius', '5px');
  soundEffectDropdown.style('padding', '5px');
  
  autonomousButton = createButton("Xhabarabot Takeover");
  autonomousButton.position(10, 120);
  autonomousButton.mousePressed(() => {
    autonomousMode = !autonomousMode;
    autonomousButton.html(autonomousMode ? "Xhabarabot Mode" : "Xhabarabot Mode");
  });
  styleButton(autonomousButton);
}

function styleButton(button) {
  button.style('background-color', '#F8F7F3');
  button.style('color', '#333');
  button.style('border', 'none');
  button.style('border-radius', '5px');
  button.style('padding', '10px 15px');
  button.style('cursor', 'pointer');
  button.style('font-family', 'Arial, sans-serif');
  button.mouseOver(() => button.style('background-color', '#ddd'));
  button.mouseOut(() => button.style('background-color', '#F9F5F6'));
}

function preload() {
  sound1 = loadSound("RullyShabaraSampleT06.mp3");
  sound2 = loadSound("RullyShabaraSampleT07.mp3");
  currentSound = random([sound1, sound2]);
}

function draw() {
  if (autonomousMode && autonomousModeActivated) {
    let x = noise(frameCount * 0.01) * width;
    let y = noise(frameCount * 0.01 + 1000) * height;

    if (lastPoint) {
      variableEllipse(x, y, lastPoint.x, lastPoint.y);
    }

    lastPoint = { x, y };
  } else {
    lastPoint = null;
    if (!paused && firstMouseClick) {
      variableEllipse(mouseX, mouseY, pmouseX, pmouseY, colorPicker.color());
    }
  }
}

function variableEllipse(x, y, px, py) {
  let speed = abs(x - px) + abs(y - py);
  let rate = map(speed, 0, 35, 0.5, 2); // Default values
  let volume = map(speed, 0, 5, 0.1, 5); // Default volume
  stroke(55);
  ellipse(x, y, speed, speed);
  ellipses.push({ x: x, y: y, size: speed, color: color });

  // Use a local variable to decide randomly
  let effect = soundEffectDropdown.value() === 'random' ? random(['slow', 'fast', 'reverse', 'default']) : soundEffectDropdown.value();

  switch (effect) {
    case 'slow':
      rate = map(speed, 0, 25, 0.15, 0.41);
      break;
    case 'fast':
      rate = map(speed, 0, 15, 1, 4);
      break;
    case 'reverse':
      // Assuming negative rate plays the sound in reverse
      rate = -1 * map(speed, 0, 35, 0.5, 2);
      break;
    case 'default':
      // Default rate and volume are already set
      break;
  }

  currentSound.rate(rate);
  currentSound.amp(volume);

  if (speed > 15 && firstMouseClick) {
    currentSound.play();
    // Switch to the other sound for the next play
    currentSound = currentSound === sound1 ? sound2 : sound1;
  }
}


function mousePressed() {
  if (autonomousMode) {
    autonomousModeActivated = true;
    autonomousButton.html("Stop Xhabarabot");
  }
  if (!firstMouseClick) {
    firstMouseClick = true;
  }
  paused = !paused;
  if (ellipses.length > 0) {
    let lastEllipse = ellipses.pop();
    fill(colorPicker.color());

    ellipse(lastEllipse.x, lastEllipse.y, lastEllipse.size, lastEllipse.size);
  }
}

function resetSketch() {
  ellipses = [];
  background(155);
}

function saveSketch() {
  saveCanvas("mySketch", "png");
}
