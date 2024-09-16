// Flocking system inspired by Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

const flock = [];
let clickedNumbers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 300; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(0);
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
}

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.number = Math.floor(random(0, 10));
    this.isVisible = true;
    this.isWeird = random() < 0.1;
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
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
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
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
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
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
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

    if (d < 20) {
      textSize(32);
      fill(255, 0, 0);
    } else {
      textSize(16);
      fill(255);
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
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  for (let boid of flock) {
    boid.handleClick();
  }
}
