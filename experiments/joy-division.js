const xOffset = 0.03;

function setup() {
  createCanvas(800, 800);
  background(0);
  stroke(255);
  noFill();
  frameRate(100);
}

function drawLine(
  lines,
  startY,
  endY,
  ySpacing,
  startX,
  endX,
  margin,
  raggedness
) {
  for (let i = 0; i < lines; i++) {
    beginShape();
    let baseY = startY + i * ySpacing;

    let verticalOffset = map(i, 0, lines - 1, -10, 10);

    for (let x = startX; x < endX; x += 5) {
      let y = baseY + verticalOffset;

      if (x > startX + margin && x < endX - margin) {
        let noiseFactor = noise(x * xOffset, i * 0.1, frameCount * 0.01);
        y += map(noiseFactor, 0, 1, -50, 50);
      } else {
        let raggedFactor = map(
          noise(x * xOffset + 100, i * 0.1, frameCount * 0.01),
          0,
          1,
          -raggedness,
          raggedness
        );
        y += raggedFactor;
      }

      y = constrain(y, startY - 15, endY + 15);
      vertex(x, y);
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

  drawLine(lines, startY, endY, ySpacing, startX, endX, margin, raggedness);
}
