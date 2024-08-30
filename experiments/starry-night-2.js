let moon;

function setup() {
  createCanvas(1000, 600);
  frameRate(10);

  // Source: Steve's Makerspace. (2022). Using Erase Function in p5.js to Make Interesting Shapes [Video]. YouTube. https://www.youtube.com/watch?v=zDlfsdT7WG8
  // Adapted from: 0.29
  moon = createGraphics(400, 400);
  moon.noStroke();
  moon.fill(250, 167, 0);
  moon.circle(200, 200, 80);
  moon.erase();
  moon.circle(240, 200, 80);
}

function draw() {
  background(11, 10, 25);
  noStroke();
  bg();

  image(moon, 605, 0);
  for (let i = 0; i < 12; i++) {
    let centerX = random(100, 800);
    let centerY = random(height - 200);
    spirals(centerX, centerY, 100, 5);
  }
}

function bg() {
  const size = 5;
  const divider = 50;
  const numRows = 130;
  const numCols = 220;
  const colors = [
    [12, 51, 135],
    [92, 167, 224],
    [131, 196, 237],
  ];
  // Source: Garrit Shaap. (2024). Noise examples, and Vera Molnár [Video]. JU Play. https://play.ju.se/media/Noise+examples%2C+and+Vera+Molnár/0_3pcpvm3q
  // Adapted from: 10:00
  let counter = 0;
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      fill(random(colors));
      const value = noise(x / divider, y / divider, counter) * size;
      ellipse(x * size, y * size, value);
    }
  }

  counter += 0.1;
}

function spirals(x, y, size, layers) {
  const colors = [
    [8, 135, 223],
    [187, 218, 243],
    [187, 218, 243],
    [247, 239, 33],
  ];
  noFill();

  for (let i = 0; i < layers; i++) {
    const s = random((size / layers) * i);
    stroke(random(colors));
    ellipse(x, y, s, s);
  }
}
