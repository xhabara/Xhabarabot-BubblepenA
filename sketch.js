let ellipses = [];
let paused = false;
let firstMouseClick = false;
let sound1, sound2;
let currentSound;
let colorPicker;
let resetButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(155);

  window.addEventListener("keydown", function (e) {
    if (e.key === "s") {
      saveSketch();
    }
  });

  colorPicker = createColorPicker("#F9F5F6");
  colorPicker.position(60, 20);

  resetButton = createButton("Reset");
  resetButton.position(10, 23);
  resetButton.mousePressed(resetSketch);
}

function preload() {
  sound1 = loadSound("RullyShabaraSampleT07.mp3");
  sound2 = loadSound("RullyShabaraSampleT06.mp3");
  currentSound = random([sound1, sound2]);
}

function draw() {
  if (!paused && firstMouseClick) {
    let color = colorPicker.color();
    variableEllipse(mouseX, mouseY, pmouseX, pmouseY, color);
  }
}

function variableEllipse(x, y, px, py) {
  let speed = abs(x - px) + abs(y - py);
  let rate = map(speed, 0, 35, 0.5, 2);
  let volume = map(speed, 0, 5, 0.1, 5);
  stroke(55);
  ellipse(x, y, speed, speed);
  ellipses.push({ x: x, y: y, size: speed, color: color });

  currentSound.rate(rate);
  currentSound.amp(volume);

  if (speed > 15 && firstMouseClick) {
    currentSound.play();
    currentSound = currentSound == sound1 ? sound2 : sound1;
  }
}

function mousePressed() {
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
