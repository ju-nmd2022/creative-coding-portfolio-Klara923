// Include Tone.js in your HTML file:
// <script src="https://cdn.jsdelivr.net/npm/tone"></script>

const flock = [];
let clickedNumbers = [];
let synth; // Initialize a synth
let chords; // Store the chord array
let chordIdx = 0; // Current chord index
let step = 0; // Step in the chord progression

let weirdNumbersCollected = 0; // Count of weird numbers collected
let totalWeirdNumbers = 0; // Total weird numbers in the game
let gameState = "playing"; // Current game state

// Initialize Tone.js
function setup() {
  createCanvas(500, 500);
  
  // Initialize the synth and gain
  synth = new Tone.Synth().toDestination();
  const gain = new Tone.Gain(0.7).toDestination();
  synth.connect(gain);

  chords = [
    'C4 E4 G4', 'D4 F#4 A4', 'E4 G#4 B4',
    'F4 A4 C5', 'G4 B4 D5'
  ].map(formatChords);

  Tone.Transport.scheduleRepeat(onRepeat, '16n');
  Tone.Transport.bpm.value = 90;

  // Start the sketch
  for (let i = 0; i < 300; i++) {
    let boid = new Boid();
    flock.push(boid);
    if (boid.isWeird) totalWeirdNumbers++; // Count total weird numbers
  }

  // Add event listener for user interaction
  document.documentElement.addEventListener('mousedown', startAudioContext);
}

// Function to start audio context on user interaction
function startAudioContext() {
  Tone.start();
  document.documentElement.removeEventListener('mousedown', startAudioContext); // Remove listener after starting
  Tone.Transport.start(); // Start the transport
}

// Play a chord on repeat
function onRepeat(time) {
  let chord = chords[chordIdx];
  let note = chord[step % chord.length];
  synth.triggerAttackRelease(note, '4n', time);
  step++;
}

// Format the chord string into an array
function formatChords(chordString) {
  return chordString.split(' ');
}

function draw() {
  background(0);
  
  if (gameState === "playing") {
    for (let boid of flock) {
      boid.edges();
      boid.flock(flock);
      boid.update();
      boid.show();
    }

    fill(255);
    rect(0, height - 50, width, 50);
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    let xOffset = width / (clickedNumbers.length + 1);
    for (let i = 0; i < clickedNumbers.length; i++) {
      text(clickedNumbers[i], xOffset * (i + 1), height - 25);
    }

    // Check for win condition
    if (weirdNumbersCollected === totalWeirdNumbers) {
      gameState = "won"; // Change game state to won
    }
  } else if (gameState === "won") {
    displayWinScreen();
  }
}

function displayWinScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Congratulations, you won!", width / 2, height / 2 - 20);
  const buttonWidth = 150;
  const buttonHeight = 50;
  fill(0, 255, 0); // Green button
  rect(width / 2 - buttonWidth / 2, height / 2 + 20, buttonWidth, buttonHeight);
  fill(255);
  textSize(24);
  text("Play again", width / 2, height / 2 + 45);
}

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.number = Math.floor(random(0, 10));
    this.isVisible = true;
    this.isWeird = random() < 0.005; // 5% chance
  }

  flock(boids) {
    let alignForce = this.align(boids);
    let cohesionForce = this.cohesion(boids);
    let separationForce = this.separation(boids);

    alignForce.mult(1.5);
    cohesionForce.mult(1.0);
    separationForce.mult(2.0);

    this.acceleration.add(alignForce);
    this.acceleration.add(cohesionForce);
    this.acceleration.add(separationForce);
  }

  align(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.velocity.mag());
      steering.sub(this.velocity);
      steering.limit(0.3);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.velocity.mag());
      steering.sub(this.velocity);
      steering.limit(0.3);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
    }
    if (steering.mag() > 0) {
      steering.setMag(this.velocity.mag());
      steering.sub(this.velocity);
      steering.limit(0.3);
    }
    return steering;
  }

  update() {
    if (this.isWeird) {
      let jitter = p5.Vector.random2D();
      jitter.mult(2);
      this.acceleration.add(jitter);
      this.velocity.limit(6);
    } else {
      this.velocity.limit(4);
    }

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  show() {
    if (!this.isVisible) return;

    let d = dist(mouseX, mouseY, this.position.x, this.position.y);

    if (this.isWeird) {
      textSize(16);
      fill(0, 255, 0); // Set color to green for weird numbers
    } else {
      if (d < 20) {
        textSize(32);
        fill(255, 0, 0);
      } else {
        textSize(16);
        fill(255);
      }
    }

    noStroke();
    textAlign(CENTER, CENTER);
    text(this.number, this.position.x, this.position.y);
  }

  handleClick() {
    let d = dist(mouseX, mouseY, this.position.x, this.position.y);
    if (d < 20 && this.isVisible) {
      clickedNumbers.push(this.number);
      this.isVisible = false;
      if (this.isWeird) {
        weirdNumbersCollected++; // Increment weird number count
      }
      this.playSound(this.number); // Play sound on click
    }
  }

  playSound(number) {
    const frequency = Tone.Frequency(200 + number * 50).toFrequency(); // Adjust frequency based on number
    synth.triggerAttackRelease(frequency, "8n"); // Play the sound
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (gameState === "playing") {
    for (let boid of flock) {
      boid.handleClick();
    }
  } else if (gameState === "won") {
    // Check if play again button is clicked
    const buttonWidth = 150;
    const buttonHeight = 50;
    if (
      mouseX > width / 2 - buttonWidth / 2 &&
      mouseX < width / 2 + buttonWidth / 2 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 20 + buttonHeight
    ) {
      resetGame(); // Reset the game
    }
  }
}

function resetGame() {
  flock.length = 0; // Clear the flock
  clickedNumbers = [];
  weirdNumbersCollected = 0;
  gameState = "playing"; // Reset game state
  totalWeirdNumbers = 0; // Reset weird numbers count

  // Reinitialize the boids
  for (let i = 0; i < 300; i++) {
    let boid = new Boid();
    flock.push(boid);
    if (boid.isWeird) totalWeirdNumbers++; // Count total weird numbers
  }
}
