// let player;
// let analyser;
// let mic;
// let isPlaying = false;

// window.addEventListener("load", () => {
//   // Tone.js setup
//   player = new Tone.Player("assets/sample.mp3", () => {
//     console.log("Sound loaded!");
//   }).toDestination();

//   // Analyser for waveform
//   analyser = new Tone.Analyser("waveform", 1024);
  
//   mic = new Tone.UserMedia();

//   // Connect the player to the analyser
//   player.connect(analyser);

//   // Optional: Connect microphone for live audio analysis
//   mic.connect(analyser);
// });

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   background(255);
//   textAlign(CENTER, CENTER);
//   textSize(24);
//   fill(0);
//   text("Click to play", width/2, height/2);
// }

// function draw() {
//   if (isPlaying) {
//     background(255);

//     // Get waveform data from the analyser
//     let waveform = analyser.getValue();

//     // Number of wave columns
//     let numColumns = 10;
//     let columnWidth = width / numColumns;

//     // Draw multiple columns
//     for (let colIndex = 0; colIndex < numColumns; colIndex++) {
//       let offsetX = colIndex * columnWidth;

//       // Calculate the average amplitude for this column
//       let startIndex = Math.floor((colIndex / numColumns) * waveform.length);
//       let endIndex = Math.floor(((colIndex + 1) / numColumns) * waveform.length);
//       let sum = 0;
//       for (let i = startIndex; i < endIndex; i++) {
//         sum += Math.abs(waveform[i]);
//       }
//       let avgAmplitude = sum / (endIndex - startIndex);

//       // Map the average amplitude to the height of the column
//       let columnHeight = map(avgAmplitude, 0, 1, 0, height);

//       // Draw the column
//       noStroke();
//       fill(0, 150, 255);
//       rect(offsetX, height - columnHeight, columnWidth, columnHeight);
//     }
//   }
// }

// function mousePressed() {
//   if (!isPlaying) {
//     // Start audio context on user interaction
//     Tone.start().then(() => {
//       player.start();
//       isPlaying = true;
//     });
//   }
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }