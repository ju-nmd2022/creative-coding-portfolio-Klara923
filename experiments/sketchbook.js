// Drawing system inspired by "Chase and flee" game created by Jeff Thompson
// https://editor.p5js.org/jeffThompson/sketches/o2nlBRPqj
// https://www.youtube.com/watch?v=zv7fViWS7CA

let chaseSpeed = 2.0;
let player;
let chasers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  player = createVector(0, 0);

  for (let i = 0; i < 100; i++) {
    let chaser = {
      pos: createVector(random(width), random(height)),
      prevPos: createVector(random(width), random(height)),
      size: random(0.1, 15),
      speed: random(1, chaseSpeed),
      color: color(random(255), random(255), random(255)),
    };
    chasers.push(chaser);
  }
}

function draw() {
  background(240, 240, 240, 1);

  for (let chaser of chasers) {
    let dir = p5.Vector.sub(player, chaser.pos);
    dir.normalize();
    dir.mult(chaser.speed);
    chaser.prevPos = chaser.pos.copy();
    chaser.pos.add(dir);

    stroke(
      chaser.color.levels[0],
      chaser.color.levels[1],
      chaser.color.levels[2],
      300
    );
    strokeWeight(2);
    line(chaser.prevPos.x, chaser.prevPos.y, chaser.pos.x, chaser.pos.y);

    noStroke();
    fill(chaser.color);
    circle(chaser.pos.x, chaser.pos.y, chaser.size);
  }

  player.x = mouseX;
  player.y = mouseY;
}
