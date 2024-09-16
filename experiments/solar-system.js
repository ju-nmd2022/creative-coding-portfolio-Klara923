let backgroundParticles = [];
let spirals = [];
let sun;
let planets = [];

const numBackgroundParticles = 1000;
const numSpirals = 0;
const numParticlesPerSpiral = 500;
const backgroundSpeed = 1;
const spiralSpeed = 0.02;
const noiseScale = 0.01;
const colorShiftSpeed = 0.05;
const canvasSize = 800;
const minPlanetSize = 1;
const maxPlanetSize = 5;

let orbitSettings = [
  { orbitRadius: 2000, orbitSpeed: 0.02, size: 10 },
  { orbitRadius: 1200, orbitSpeed: 0.015, size: 8.5 },
  { orbitRadius: 1400, orbitSpeed: 0.01, size: 9 },
  { orbitRadius: 1600, orbitSpeed: 0.02, size: 9.5 },
  { orbitRadius: 1800, orbitSpeed: 0.003, size: 10 },
  { orbitRadius: 2000, orbitSpeed: 0.008, size: 10.5 },
  { orbitRadius: 2200, orbitSpeed: 0.018, size: 11 },
];

const sunColor = [
  hexToRgb("#F29F05"),
  hexToRgb("#F2E205")
];

const planetColors = [
  hexToRgb("#4AC181"),
  hexToRgb("#B5D6F5"),
  hexToRgb("#EBEA54"),
  hexToRgb("#FF6347"),
  hexToRgb("#87CEEB"),
];

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

class Spiral {
  constructor(x, y, size, colors) {
    this.center = createVector(x, y);
    this.size = size;
    this.particles = [];
    this.colors = colors;

    for (let i = 0; i < numParticlesPerSpiral; i++) {
      let angle = random(TWO_PI);
      let radius = random(1, 5) * this.size;
      this.particles.push({
        pos: createVector(
          this.center.x + cos(angle) * radius,
          this.center.y + sin(angle) * radius
        ),
        angle: angle,
        radius: radius,
        size: this.size,
        colors: this.colors,
      });
    }
  }

  update() {
    for (let p of this.particles) {
      let color = random(p.colors);
      fill(color[0], color[1], color[2], 150);
      ellipse(p.pos.x, p.pos.y, 5, 5);

      p.angle += spiralSpeed;
      p.radius -= 0.5;
      p.pos.x = this.center.x + cos(p.angle) * p.radius;
      p.pos.y = this.center.y + sin(p.angle) * p.radius;

      if (p.radius < 0) {
        p.angle = random(TWO_PI);
        p.radius = 5 * this.size;
        p.pos.x = this.center.x + cos(p.angle) * p.radius;
        p.pos.y = this.center.y + sin(p.angle) * p.radius;
      }
    }
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);

  let maxRadius = min(width, height) / 2 - 50;
  orbitSettings = orbitSettings.map((settings, index) => {
    let relativeRadius = (index + 1) / orbitSettings.length;
    return {
      ...settings,
      orbitRadius: relativeRadius * maxRadius * 1.8,
    };
  });

  sun = new Spiral(width / 2, height / 2, 10, sunColor);

  for (let i = 0; i < orbitSettings.length; i++) {
    let randomSize = random(minPlanetSize, maxPlanetSize);
    let planetColorsForThisPlanet = [random(planetColors), random(planetColors)];

    let planet = new Spiral(
      width / 2 + orbitSettings[i].orbitRadius,
      height / 2,
      randomSize,
      planetColorsForThisPlanet
    );
    planet.orbitAngle = 0;
    planet.orbitSpeed = orbitSettings[i].orbitSpeed;
    planet.orbitRadius = orbitSettings[i].orbitRadius;
    planets.push(planet);
  }

  noStroke();
}

function draw() {
  background(0, 20);

  sun.update();

  for (let planet of planets) {
    planet.orbitAngle += planet.orbitSpeed;
    let newX = width / 2 + cos(planet.orbitAngle) * planet.orbitRadius;
    let newY = height / 2 + sin(planet.orbitAngle) * planet.orbitRadius;
    let movement = createVector(newX - planet.center.x, newY - planet.center.y);

    planet.center.set(newX, newY);

    for (let p of planet.particles) {
      p.pos.add(movement);
    }

    noFill();
    stroke(100, 50);
    ellipse(width / 2, height / 2, planet.orbitRadius * 2);
    noStroke();

    planet.update();
  }

  for (let spiral of spirals) {
    spiral.update();
  }
}
