246322

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

function saveSketch() {
  saveCanvas("mySketch", "png");
}
