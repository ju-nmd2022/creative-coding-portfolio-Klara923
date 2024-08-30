let moon;

function setup() {
  createCanvas(1000, 600);
  frameRate(1.2);

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

  bg();

  image(moon, 605, 0);

  for (let i = 0; i < 12; i++) {
    const centerX = random(width);
    const centerY = random(height - 200);
    spiral(centerX, centerY);
  }

  peak(200);
}

function peak(centerX) {
  noStroke();
  fill(10, 8, 4);
  triangle(centerX - 100, 800, centerX + 100, 900, centerX, 105);
}

function spiral(centerX, centerY) {
  const radiusIncrement = random(0.01, 0.05);
  const lineLength = random(1, 3);
  const steps = 100;
  let radius = random(1, 2);
  let angle = 0;
  strokeWeight(5);
  strokeCap(ROUND);

  const strokeColors = [
    [125, 198, 70],
    [92, 167, 224],
    [131, 196, 237],
  ];

  for (let i = 0; i < steps * 10; i++) {
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;

    angle += 0.1;
    radius += radiusIncrement;

    const x2 = centerX + Math.cos(angle) * (radius + lineLength);
    const y2 = centerY + Math.sin(angle) * (radius + lineLength);

    const colorIndex = int(random(strokeColors.length));
    stroke(
      strokeColors[colorIndex][0],
      strokeColors[colorIndex][1],
      strokeColors[colorIndex][2]
    );

    line(x1, y1, x2, y2);
  }

  push();
  strokeWeight(8);
  stroke(238, 232, 11);
  fill(250, 167, 0);
  ellipse(centerX, centerY, 15, 15);
  pop();
}

function bg() {
  const lineLength = 10;
  const spaceBetween = 4;
  strokeWeight(5);
  strokeCap(ROUND);

  const colorsWave = [
    [161, 192, 248],
    [38, 102, 225],
    [8, 33, 102],
    [133, 183, 242],
  ];

  for (let i = 0; i < 80; i++) {
    const originalY = 100 + random(-100, 500);
    const frequency = 0.01 + random(0.01);
    const amplitude = 10 + random(20);

    for (let x = 0; x < width; x += lineLength + spaceBetween) {
      const y = originalY + sin(x * frequency) * amplitude;
      const nextY = originalY + sin((x + lineLength) * frequency) * amplitude;

      let colorWave;
      if (random() < map(x, 0, width / 4, 0.8, 0.2)) {
        colorWave = colorsWave[2];
      } else {
        colorWave = colorsWave[int(random(colorsWave.length))];
      }

      stroke(colorWave[0], colorWave[1], colorWave[2]);

      line(x, y, x + lineLength, nextY);
    }
  }

  const colorsSpiral = [
    [8, 135, 223],
    [187, 218, 243],
    [187, 218, 243],
    [247, 239, 33],
  ];

  const centerX = width - 200;
  const centerY = 200;
  let angle = 0;
  let radius = 5;

  for (let i = 0; i < 1000; i++) {
    const x = centerX + radius * cos(angle);
    const y = centerY + radius * sin(angle);
    const nextX = centerX + (radius + lineLength) * cos(angle + 0.1);
    const nextY = centerY + (radius + lineLength) * sin(angle + 0.1);

    let colorSpiral;
    if (random() < 0.8) {
      colorSpiral = colorsSpiral[int(random(2))];
    } else {
      colorSpiral = colorsSpiral[2 + int(random(2))];
    }

    stroke(colorSpiral[0], colorSpiral[1], colorSpiral[2]);

    line(x, y, nextX, nextY);

    angle += 0.05;
    radius += 0.05;
  }
}
