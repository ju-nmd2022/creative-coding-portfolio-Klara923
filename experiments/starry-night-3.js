let backgroundParticles = [];
let spirals = [];
const numBackgroundParticles = 1000;
const numSpirals = 6;
const numParticlesPerSpiral = 200;
const backgroundSpeed = 1;
const spiralSpeed = 0.02;
const noiseScale = 0.01;
const colorShiftSpeed = 0.05;
const minDistanceBetweenSpirals = 150;

const yellowShades = [
  hexToRgb("#F29F05"),
  hexToRgb("#F2E205"),
  hexToRgb("#4AC181"),
  hexToRgb("#B5D6F5"),
  hexToRgb("#EBEA54"),
];

const blueShades = [
  hexToRgb("#0D47A1"),
  hexToRgb("#1976D2"),
  hexToRgb("#42A5F5"),
  hexToRgb("#BBDEFB"),
  hexToRgb("#64B5F6"),
];

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = (bigint & 255);
  return [r, g, b];
}

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < numBackgroundParticles; i++) {
    backgroundParticles.push(createVector(random(width), random(height)));
  }
  while (spirals.length < numSpirals) {
    let spiralSize = random(0.5, 1);
    let radius = random(20, 100) * spiralSize;
    let centerX = random(radius, width - radius);
    let centerY = random(radius, height - radius);
    let overlapping = spirals.some((spiral) => {
      let d = dist(centerX, centerY, spiral.center.x, spiral.center.y);
      return d < minDistanceBetweenSpirals;
    });
    if (!overlapping) {
      let spiralParticles = [];
      let spiralColors = [];
      for (let i = 0; i < 3; i++) {
        spiralColors.push(random(yellowShades));
      }
      for (let j = 0; j < numParticlesPerSpiral; j++) {
        let angle = random(TWO_PI);
        let particleRadius = random(20, 100) * spiralSize;
        spiralParticles.push({
          pos: createVector(
            centerX + cos(angle) * particleRadius,
            centerY + sin(angle) * particleRadius
          ),
          angle: angle,
          radius: particleRadius,
          size: spiralSize,
          colors: spiralColors,
        });
      }
      spirals.push({
        center: createVector(centerX, centerY),
        particles: spiralParticles,
        size: spiralSize,
        colors: spiralColors,
      });
    }
  }
  noStroke();
}

function draw() {
  background(0, 20);
  for (let i = backgroundParticles.length - 1; i >= 0; i--) {
    let p = backgroundParticles[i];
    let n = noise(p.x * noiseScale, p.y * noiseScale);
    let blueColor = random(blueShades);
    fill(blueColor[0], blueColor[1], blueColor[2], 150);
    ellipse(p.x, p.y, 4, 4);
    let angle = map(n, 0, 1, -PI / 4, PI / 4);
    p.x += cos(angle) * backgroundSpeed;
    p.y += sin(angle) * backgroundSpeed;
    if (!onScreen(p)) {
      p.x = 0;
      p.y = random(height);
    }
  }
  for (let spiral of spirals) {
    for (let p of spiral.particles) {
      let color = random(p.colors);
      fill(color[0], color[1], color[2], 150);
      ellipse(p.pos.x, p.pos.y, 4, 4);
      p.angle += spiralSpeed;
      p.radius -= 0.1;
      p.pos.x = spiral.center.x + cos(p.angle) * p.radius;
      p.pos.y = spiral.center.y + sin(p.angle) * p.radius;
      if (p.radius < 0) {
        p.angle = random(TWO_PI);
        p.radius = random(20, 100) * spiral.size;
        p.pos.x = spiral.center.x + cos(p.angle) * p.radius;
        p.pos.y = spiral.center.y + sin(p.angle) * p.radius;
      }
    }
  }
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
