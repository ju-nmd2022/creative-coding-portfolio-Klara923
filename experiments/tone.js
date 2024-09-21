let player;
let analyser;
let mic;
let isPlaying = false; // Flag to control when the waveform is drawn
const xOffset = 0.03; // For noise factor

window.addEventListener("load", () => {
  // Tone.js setup
  player = new Tone.Player("assets/sample.mp3", () => {
    console.log("Sound loaded!");
  }).toDestination(); // This loads your custom sound and sends it to speakers

  // Analyser for waveform
  analyser = new Tone.Analyser("waveform", 1024);

  mic = new Tone.UserMedia();

  // Connect the player to the analyser
  player.connect(analyser);

  // Optional: Connect microphone for live audio analysis
  mic.connect(analyser);
});

window.addEventListener("click", () => {
  // When the user clicks, start the sound and allow the waveform to be drawn
  if (!isPlaying) {
    player.start();
    isPlaying = true; // Set flag to true so the waveform will be drawn
  }
});

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0); // Black background for better wave visibility

  // Only draw the waveform if the sound is playing
  if (isPlaying) {
    // Get waveform data from the analyser
    let waveform = analyser.getValue();

    // Number of waveforms to display
    let numWaves = 10;
    let waveHeight = height / numWaves; // Height of each waveform section
    let ySpacing = waveHeight / 2; // Spacing between waves

    // Vertical range for noise mapping
    let startY = 0;
    let endY = height;

    // Start drawing multiple waveforms, one for each row
    for (let waveIndex = 0; waveIndex < numWaves; waveIndex++) {
      let baseY = waveIndex * waveHeight + waveHeight / 2; // Vertical position for each wave's baseline
      let verticalOffset = map(waveIndex, 0, numWaves - 1, -10, 10); // Smooth vertical variation

      stroke(255); // Wave color
      strokeWeight(2);
      noFill();

      beginShape();
      for (let i = 0; i < waveform.length; i++) {
        // Map waveform values (-1, 1) to a constrained vertical range (raggedness)
        let x = map(i, 0, waveform.length, 0, width); // Spread waveform horizontally
        let y = baseY + verticalOffset;

        // Apply noise to create smooth organic wave shapes
        if (x > 100 && x < width - 100) {
          let noiseFactor = noise(x * xOffset, waveIndex * 0.1, frameCount * 0.01);
          y += map(noiseFactor, 0, 1, -50, 50); // Smooth and random movement of the waveform
        } else {
          let raggedFactor = map(
            noise(x * xOffset + 100, waveIndex * 0.1, frameCount * 0.01),
            0,
            1,
            -5,
            5
          );
          y += raggedFactor; // Edge raggedness
        }

        y = constrain(y, startY + waveIndex * ySpacing - 15, endY - (numWaves - waveIndex) * ySpacing + 15); // Constrain within the section
        vertex(x, y);
      }
      endShape();
    }
  }
}




// let player;
// let analyser;
// let mic;
// let isPlaying = false; // Flag to control when the waveform is drawn

// window.addEventListener("load", () => {
//   // Tone.js setup
//   player = new Tone.Player("assets/sample.mp3", () => {
//     console.log("Sound loaded!");
//   }).toDestination(); // This loads your custom sound and sends it to speakers

//   // Analyser for waveform
//   analyser = new Tone.Analyser("waveform", 1024);

//   mic = new Tone.UserMedia();

//   // Connect the player to the analyser
//   player.connect(analyser);

//   // Optional: Connect microphone for live audio analysis
//   mic.connect(analyser);
// });

// window.addEventListener("click", () => {
//   // When the user clicks, start the sound and allow the waveform to be drawn
//   if (!isPlaying) {
//     player.start();
//     isPlaying = true; // Set flag to true so the waveform will be drawn
//   }
// });

// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function draw() {
//   background(255);

//   // Only draw the waveform if the sound is playing
//   if (isPlaying) {
//     // Get waveform data from the analyser
//     let waveform = analyser.getValue();

//     // Number of waveforms to display
//     let numWaves = 10;
//     let waveHeight = height / numWaves; // Height of each waveform section

//     // Start drawing multiple waveforms, one for each row
//     for (let waveIndex = 0; waveIndex < numWaves; waveIndex++) {
//       let offsetY = waveIndex * waveHeight; // Vertical position for each wave

//       stroke(0, 150, 255); // Wave color
//       strokeWeight(2);
//       noFill();

//       beginShape();
//       for (let i = 0; i < waveform.length; i++) {
//         // Map waveform values (-1, 1) to the range of each waveHeight section
//         let x = map(i, 0, waveform.length, 0, width); // Spread waveform horizontally
//         let y = map(waveform[i], -1, 1, offsetY + waveHeight, offsetY); // Position each wave vertically in its section

//         // Create vertices for the waveform shape
//         vertex(x, y);
//       }
//       endShape();
//     }
//   }
// }














// let player;
// let analyser;
// let mic;
// let isPlaying = false; // Flag to control when the waveform is drawn

// window.addEventListener("load", () => {
//   // Tone.js setup
//   player = new Tone.Player("assets/sample.mp3", () => {
//     console.log("Sound loaded!");
//   }).toDestination(); // This loads your custom sound and sends it to speakers

//   // Analyser for waveform
//   analyser = new Tone.Analyser("waveform", 1024);
  
//   mic = new Tone.UserMedia();

//   // Connect the player to the analyser
//   player.connect(analyser);

//   // Optional: Connect microphone for live audio analysis
//   mic.connect(analyser);
// });

// window.addEventListener("click", () => {
//   // When the user clicks, start the sound and allow the waveform to be drawn
//   if (!isPlaying) {
//     player.start();
//     isPlaying = true; // Set flag to true so the waveform will be drawn
//   }
// });

// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function draw() {
//   background(255);

//   // Only draw the waveform if the sound is playing
//   if (isPlaying) {
//     // Get waveform data from the analyser
//     let waveform = analyser.getValue();

//     // Number of wave columns
//     let numWaves = 10;
//     let waveWidth = width / numWaves; // Width of each column

//     // Start drawing multiple waveforms, one for each column
//     for (let waveIndex = 0; waveIndex < numWaves; waveIndex++) {
//       let offsetX = waveIndex * waveWidth; // Horizontal position for each wave

//       stroke(0, 150, 255); // Wave color
//       strokeWeight(2);
//       noFill();

//       beginShape();
//       for (let i = 0; i < waveform.length; i++) {
//         // Map waveform values (-1, 1) to canvas height (0, height)
//         let x = map(i, 0, waveform.length, offsetX, offsetX + waveWidth); // Spread waveform horizontally
//         let y = map(waveform[i], -1, 1, height, 0); // Invert y-axis for correct orientation

//         // Create vertices for the waveform shape
//         vertex(x, y);
//       }
//       endShape();
//     }
//   }
// }










// // Create a Tone.js synth
// const synth = new Tone.Synth().toDestination();

// // Create a container to hold the buttons and center it
// const container = document.createElement('div');
// container.style.display = 'flex';
// container.style.justifyContent = 'center';
// container.style.alignItems = 'center';
// container.style.height = '100vh';  // Full height of the viewport
// container.style.flexDirection = 'column'; // Stack buttons vertically
// document.body.appendChild(container);

// // Create the 'Start' button
// const startButton = document.createElement('button');
// startButton.innerHTML = 'Start';
// startButton.style.margin = '10px'; // Add some margin between buttons
// container.appendChild(startButton);

// // Create the 'Stop' button
// const stopButton = document.createElement('button');
// stopButton.innerHTML = 'Stop';
// stopButton.style.margin = '10px'; // Add some margin between buttons
// container.appendChild(stopButton);

// // Play the sound when the Start button is clicked
// startButton.addEventListener('click', () => {
//   synth.triggerAttackRelease("C4", "8n");
// });

// // Stop any ongoing sound (if needed for future enhancements)
// stopButton.addEventListener('click', () => {
//   synth.triggerRelease();
// });
