// Step Sequencer inspired by jake with colorful flow field
// https://codepen.io/jak_e/pen/qxjPMM/
// https://www.youtube.com/watch?v=Dxxkma4F-oA&list=PLTujTdKucISz9rx7gGqei3fAGrtA97uY0&index=3

document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") {
    Tone.start();
  }
});

const synths = [new Tone.Synth(), new Tone.Synth(), new Tone.Synth()];

synths.forEach((synth) => {
  synth.oscillator.type = "sine";
});

const gain = new Tone.Gain(0.6);
gain.toDestination();
synths.forEach((synth) => synth.connect(gain));

function createSynthGrid() {
  const container = document.createElement("div");

  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.height = "100vh";

  for (let i = 0; i < 3; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.margin = "10px";

    for (let j = 0; j < 8; j++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.margin = "5px";
      rowDiv.appendChild(checkbox);
    }

    container.appendChild(rowDiv);
  }

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";
  document.body.appendChild(canvas);

  document.body.appendChild(container);
}

createSynthGrid();

const $rows = document.body.querySelectorAll("div > div"),
  notes = ["G5", "E4", "C3"];
let index = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const resolution = 80;
const cols = Math.floor(canvas.width / resolution);
const rows = Math.floor(canvas.height / resolution);
let flowField = new Array(cols * rows);

const particles = [];
const numParticles = 50;

class Particle {
  constructor() {
    this.pos = createVector(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
    this.vel = createVector(0, 0);
    this.maxSpeed = 0.5;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  }

  update() {
    this.pos.add(this.vel);
    this.wrap();
  }

  wrap() {
    if (this.pos.x > canvas.width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = canvas.width;
    if (this.pos.y > canvas.height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = canvas.height;
  }

  follow(flowField) {
    let x = Math.floor(this.pos.x / resolution);
    let y = Math.floor(this.pos.y / resolution);
    let index = x + y * cols;
    if (flowField[index]) {
      this.vel = flowField[index];
    }
  }

  show() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function createVector(x, y) {
  return {
    x,
    y,
    add(v) {
      this.x += v.x;
      this.y += v.y;
    },
  };
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

let zoff = 0;
let activeCheckboxCount = 0;
function updateFlowField() {
  if (activeCheckboxCount === 0) return;

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * Math.PI * 2;
      let v = createVector(
        Math.cos(angle) * (0.1 * activeCheckboxCount),
        Math.sin(angle) * (0.1 * activeCheckboxCount)
      );
      flowField[index] = v;
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  zoff += 0.01;
}

function noise(x, y, z) {
  return (Math.sin(x * 10 + y * 5 + z * 2) + 1) / 2;
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateFlowField();

  for (let particle of particles) {
    if (activeCheckboxCount === 0) {
      particle.vel = createVector(0, 0);
    } else {
      particle.follow(flowField);
    }
    particle.update();
    particle.show();
  }

  requestAnimationFrame(draw);
}

draw();

Tone.Transport.scheduleRepeat(repeat, "8n");
Tone.Transport.start();

function repeat(time) {
  let step = index % 8;
  activeCheckboxCount = 0;
  for (let i = 0; i < $rows.length; i++) {
    let synth = synths[i],
      note = notes[i],
      $row = $rows[i],
      $input = $row.querySelector(`input:nth-child(${step + 1})`);

    if ($input.checked) {
      synth.triggerAttackRelease(note, "8n", time);
      activeCheckboxCount++;

      let particle = particles[Math.floor(Math.random() * particles.length)];
      particle.vel = createVector(
        (Math.random() - 0.05) * 0.05,
        (Math.random() - 0.05) * 0.05
      );
      particle.color = `hsl(${i * 120}, 50%, 50%)`;
    }
  }
  index++;
}
