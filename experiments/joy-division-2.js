const xOffset = 0.03;

function setup() {
  createCanvas(800, 800);
  background(0);
  stroke(255);
  noFill();
  frameRate(10);
}

function drawCirclesAlongLine(
  lines,
  startY,
  endY,
  ySpacing,
  startX,
  endX,
  margin,
  raggedness,
  circleSize
) {
  for (let i = 0; i < lines; i++) {
    beginShape();
    const baseY = startY + i * ySpacing;

    const verticalOffset = map(i, 0, lines - 1, -10, 10);

    for (let x = startX; x < endX; x += 5) {
      let y = baseY + verticalOffset;

      if (x > startX + margin && x < endX - margin) {
        const noiseFactor = noise(x * xOffset, i * 0.1, frameCount * 0.01);
        y += map(noiseFactor, 0, 1, -50, 50);
      } else {
        const raggedFactor = map(
          noise(x * xOffset + 100, i * 0.1, frameCount * 0.01),
          0,
          1,
          -raggedness,
          raggedness
        );
        y += raggedFactor;
      }

      y = constrain(y, startY - 15, endY + 15);

      fill(255);
      noStroke();
      ellipse(x, y, circleSize);
    }
    endShape();
  }
}

function draw() {
  background(0);

  const lines = 50;
  const startY = height / 6;
  const endY = (3 * height) / 4;
  const ySpacing = (endY - startY) / (lines - 1);

  const startX = width / 4;
  const endX = (3 * width) / 4;

  const margin = 100;
  const raggedness = 5;
  const circleSize = 1.5;

  drawCirclesAlongLine(
    lines,
    startY,
    endY,
    ySpacing,
    startX,
    endX,
    margin,
    raggedness,
    circleSize
  );
}
