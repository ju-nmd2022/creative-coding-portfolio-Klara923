let player;
let analyser;
let mic;
let isPlaying = false; 
const xOffset = 0.03; 

window.addEventListener("load", () => {
  player = new Tone.Player("assets/sample.mp3", () => {
    console.log("Sound loaded!");
  }).toDestination(); 

  analyser = new Tone.Analyser("waveform", 1024);

  mic = new Tone.UserMedia();

  player.connect(analyser);

  mic.connect(analyser);
});

window.addEventListener("click", () => {
  if (!isPlaying) {
    player.start();
    isPlaying = true;
  }
});

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0); 

  if (isPlaying) {
    let waveform = analyser.getValue();
    let numWaves = 10;
    let waveHeight = height / numWaves; 
    let ySpacing = waveHeight / 2; 

    let startY = 0;
    let endY = height;

    for (let waveIndex = 0; waveIndex < numWaves; waveIndex++) {
      let baseY = waveIndex * waveHeight + waveHeight / 2; 
      let verticalOffset = map(waveIndex, 0, numWaves - 1, -10, 10); 

      stroke(255); 
      strokeWeight(2);
      noFill();

      beginShape();
      for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width); 
        let y = baseY + verticalOffset;

        if (x > 100 && x < width - 100) {
          let noiseFactor = noise(x * xOffset, waveIndex * 0.1, frameCount * 0.01);
          y += map(noiseFactor, 0, 1, -50, 50); 
        } else {
          let raggedFactor = map(
            noise(x * xOffset + 100, waveIndex * 0.1, frameCount * 0.01),
            0,
            1,
            -5,
            5
          );
          y += raggedFactor;
        }

        y = constrain(y, startY + waveIndex * ySpacing - 15, endY - (numWaves - waveIndex) * ySpacing + 15); // Constrain within the section
        vertex(x, y);
      }
      endShape();
    }
  }
}
