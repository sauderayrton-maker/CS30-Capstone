//----- Constants -----//
const CORNERRADIUS = 8;
const SURFACE = "#252220";
const PLAYHEAD_COLOR = "#e6c200";
const PLAYHEAD_SHADOW = "rgba(230, 194, 0, 0.15)";
const ACTIVE_COLOR = "#e6c200";
const ACTIVE_BRIGHT = "#f5e68a";
const ACTIVE_BORDER = "#a68f00";
const INACTIVE_NATURAL = "#1a1714";
const INACTIVE_SHARP = "#131009";
const INACTIVE_NATURAL2 = "#1e1a15";
const INACTIVE_SHARP2 = "#161208";
const INACTIVE_COL_HIGHLIGHT = "#3a3530";
const HEADER_TEXT_ACTIVE = "#e6c200";
const HEADER_TEXT_INACTIVE = "#4d4a46";
const STROKES = "#3a3530";
const BG = "#0f0d0a";
const PIANO_W = 68;
const HEADER_H = 36;
const PAD = 8;
const OCTAVES = 3;
const COLS = 64;
const HIGHEST = 95;
const GRAB = 10; // px from the right edge that counts as a drag handle

//----- Notes Setup -----//
let noteNames = [
  "B",
  "Bb",
  "A",
  "Ab",
  "G",
  "Gb",
  "F",
  "E",
  "Eb",
  "D",
  "Db",
  "C",
]; // top to bottom in an octave
let blackKeys = [1, 3, 5, 8, 10]; // which rows in each octave are black keys
let waves = ["sine", "triangle", "square", "sawtooth"];

//----- Variables -----//
let rows = OCTAVES * 12;
let noteW, noteH;
let notes = [];
let isPlaying = false;
let bpm = 120;
let beat = 0;
let nextTick = 0;
let wave = 0;
let hoveredNote = null;
let p5Canvas;
let recorder;
let theFile;
let isRecording = false;
let grabbed = null;
let grabX = 0;

class MakeNote {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = noteH;
    this.width = noteW;
    this.noteLength = 1; // how many columns it spans
  }

  display() {
    if (this.noteLength > 0) {
      fill(ACTIVE_COLOR);
      noStroke();
      rect(
        this.x,
        this.y,
        this.width * this.noteLength,
        this.height,
        CORNERRADIUS / 3,
        CORNERRADIUS / 3,
        CORNERRADIUS / 3,
        CORNERRADIUS / 3,
      );
      fill(ACTIVE_BRIGHT);
      noStroke();
      rect(this.x, this.y, this.width * this.noteLength, 1, CORNERRADIUS / 2);
      fill(ACTIVE_BRIGHT);
      rect(
        this.x + this.width * this.noteLength - 4,
        this.y + 2,
        3,
        this.height - 4,
        1,
      ); // drag handle tab
    }
  }

  contains(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.width * this.noteLength &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }
}

//----- Setup -----//
function setup() {
  let renderer = createCanvas(windowWidth, windowHeight);
  p5Canvas = renderer;
  noteH = (height - HEADER_H) / rows;
  noteW = (width - PIANO_W) / COLS;
  recorder = new p5.SoundRecorder();
  theFile = new p5.SoundFile();
  recorder.setInput();
}

//----- Draw  -----//
function draw() {
  background(BG);
  drawHeader();
  drawGrid();
  drawPiano();
  for (let n of notes) {
    n.display();
  }
  if (isPlaying) {
    tick();
    drawPlayhead();
  }
}

//----- Header -----//
function drawHeader() {
  noStroke();
  fill(SURFACE);
  rect(0, 0, width, HEADER_H, CORNERRADIUS);
  if (isRecording) {
    fill("#e62200");
    textSize(11);
    textAlign(LEFT, CENTER);
    text("● REC", PAD, HEADER_H / 2);
  }
  textAlign(CENTER, CENTER);
  for (let x = 0; x < COLS; x++) {
    let px = PIANO_W + x * noteW + noteW / 2;
    if (x % 16 === 0) {
      fill(HEADER_TEXT_ACTIVE);
      textSize(11);
      text(floor(x / 16) + 1, px, HEADER_H / 2); // bar number
    } else if (x % 4 === 0) {
      fill(HEADER_TEXT_INACTIVE);
      textSize(9);
      text((floor(x / 4) % 4) + 1, px, HEADER_H / 2); // beat number within bar
    }
  }
}

//----- Grid -----//
function drawGrid() {
  for (let y = 0; y < rows; y++) {
    let isSharp = blackKeys.includes(y % 12);
    for (let x = 0; x < COLS; x++) {
      let px = PIANO_W + x * noteW;
      let py = HEADER_H + y * noteH;
      if (isPlaying && x === beat) {
        fill(INACTIVE_COL_HIGHLIGHT);
      } else {
        let evenGroup = floor(x / 4) % 2 === 0; // alternate shade every 4 columns
        if (isSharp) {
          fill(evenGroup ? INACTIVE_SHARP : INACTIVE_SHARP2);
        } else {
          fill(evenGroup ? INACTIVE_NATURAL : INACTIVE_NATURAL2);
        }
      }
      noStroke();
      rect(px, py, noteW, noteH, CORNERRADIUS / 4);
    }
  }
}

//----- Piano Keys -----//
function drawPiano() {
  for (let y = 0; y < rows; y++) {
    let noteIndex = y % 12;
    let isBlack = blackKeys.includes(noteIndex);
    let octave = OCTAVES + 1 - floor(y / 12);
    let py = HEADER_H + y * noteH;
    fill(isBlack ? "#141108" : SURFACE);
    stroke(STROKES);
    strokeWeight(0.5);
    rect(0, py, PIANO_W, noteH, CORNERRADIUS / 4);
    if (isBlack) {
      noStroke();
      fill("#0a0908");
      rect(0, py, PIANO_W * 0.6, noteH, CORNERRADIUS / 5); // shorter than white keys
    }
    if (noteIndex === 11) {
      fill(ACTIVE_COLOR);
      noStroke();
      textSize(9);
      textAlign(RIGHT, CENTER);
      text("C" + octave, PIANO_W - 5, py + noteH / 2); // label every C
    }
  }
  noStroke();
  fill(SURFACE);
  rect(0, 0, PIANO_W, HEADER_H, CORNERRADIUS / 2); // cover the top-left corner so text draws on top
  fill(HEADER_TEXT_ACTIVE);
  textSize(10);
  textAlign(LEFT, CENTER);
  text(bpm + " BPM", PAD, HEADER_H / 2 - 6);
  text(waves[wave].toUpperCase(), PAD, HEADER_H / 2 + 6);
  stroke(STROKES);
  strokeWeight(1);
  line(PIANO_W, 0, PIANO_W, height);
  line(0, HEADER_H, PIANO_W, HEADER_H);
}

//----- Playhead -----//
function drawPlayhead() {
  let px = PIANO_W + beat * noteW;
  noStroke();
  fill(PLAYHEAD_SHADOW);
  rect(px, HEADER_H, noteW, height - HEADER_H);
  fill(PLAYHEAD_COLOR);
  triangle(
    px,
    HEADER_H - 1,
    px + noteW,
    HEADER_H - 1,
    px + noteW / 2,
    HEADER_H + 8,
  );
}

//----- Tick -----//
function tick() {
  let interval = ((60 / bpm) * 1000) / 4; // ms per 16th note
  if (millis() >= nextTick) {
    hitCol(beat);
    beat = (beat + 1) % COLS;
    nextTick = millis() + interval;
  }
}

//----- Hit Column -----//
function hitCol(col) {
  let dur = 60 / bpm / 4; // seconds per 16th note
  for (let n of notes) {
    let noteCol = round((n.x - PIANO_W) / noteW);
    if (noteCol === col) {
      let row = round((n.y - HEADER_H) / noteH);
      ping(getFreq(row), dur * n.noteLength);
    }
  }
}

//----- Get Frequency -----//
function getFreq(row) {
  let noteIndex = row % 12;
  let octave = OCTAVES + 1 - floor(row / 12);
  let midi = (octave + 1) * 12 + (11 - noteIndex);
  return 440 * pow(2, (midi - 69) / 12); // A4 = 440hz
}

//----- Ping -----//
function ping(freq, dur) {
  let osc = new p5.Oscillator(waves[wave]);
  osc.start();
  osc.freq(freq);
  osc.amp(0.25, 0.01);
  setTimeout(
    function () {
      osc.amp(0, 0.08);
      setTimeout(function () {
        osc.stop();
      }, 150);
    },
    max(50, dur * 1000 - 80), // wait until near the end of the note duration
  );
} //p5 reference https://p5js.org/reference/#/p5.Oscillator

//----- Window Resize -----//
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noteH = (height - HEADER_H) / rows;
  noteW = (width - PIANO_W) / COLS;
  for (let n of notes) {
    n.height = noteH;
    n.width = noteW;
  }
}

//----- Mouse Handlers -----//
function mousePressed() {
  if (mouseX < PIANO_W || mouseY < HEADER_H) {
    if (mouseX < PIANO_W && mouseY > HEADER_H) {
      let row = floor((mouseY - HEADER_H) / noteH);
      if (row >= 0 && row < rows) {
        ping(getFreq(row), 0.3); // preview on piano key click
      }
    }
    return;
  }

  for (let n of notes) {
    let rightEdge = n.x + n.width * n.noteLength;
    if (
      mouseY >= n.y &&
      mouseY < n.y + n.height &&
      mouseX >= rightEdge - GRAB &&
      mouseX <= rightEdge + 2
    ) {
      grabbed = n;
      grabX = mouseX;
      return;
    }
  }

  let hit = notes.find(function (n) {
    return n.contains(mouseX, mouseY);
  });
  if (hit) {
    notes = notes.filter(function (n) {
      return n !== hit;
    });
    return;
  }

  let snapX = PIANO_W + floor((mouseX - PIANO_W) / noteW) * noteW;
  let snapY = HEADER_H + floor((mouseY - HEADER_H) / noteH) * noteH;
  let row = floor((mouseY - HEADER_H) / noteH);
  ping(getFreq(row), 0.3);
  notes.push(new MakeNote(snapX, snapY));
}

function mouseDragged() {
  if (!grabbed) {
    return;
  }
  let col = floor((mouseX - PIANO_W) / noteW);
  let startCol = floor((grabbed.x - PIANO_W) / noteW);
  grabbed.noteLength = max(1, col - startCol + 1);
}

function mouseReleased() {
  grabbed = null;
}

//----- Keybinds -----//
function keyPressed() {
  if (key === " ") {
    isPlaying = !isPlaying;
    if (isPlaying) {
      beat = 0;
      nextTick = millis();
    }
    return false; // stop space from scrolling the page
  }
  if (keyCode === UP_ARROW) {
    bpm = min(bpm + 5, 300);
  }
  if (keyCode === DOWN_ARROW) {
    bpm = max(bpm - 5, 40);
  }
  if (key === "w" || key === "W") {
    wave = (wave + 1) % waves.length;
  }
  if (key === "e" || key === "E") {
    exportSound();
  }
  if (key === "c" || key === "C") {
    notes = [];
  }
  if (key === "s" || key === "S") {
    saveGrid();
  }
  if (key === "l" || key === "L") {
    loadGrid();
  }
}

//----- Presets ai slop -----//
const PRESETS = {
  girlsWantGirls: {
    bpm: 140,
    notes: [
      { col: 0, row: 5, noteLength: 2 }, // F#4
      { col: 2, row: 7, noteLength: 1 }, // E4
      { col: 3, row: 9, noteLength: 1 }, // D4
      { col: 4, row: 5, noteLength: 2 }, // F#4
      { col: 6, row: 7, noteLength: 1 }, // E4
      { col: 7, row: 9, noteLength: 1 }, // D4
      { col: 8, row: 7, noteLength: 2 }, // E4
      { col: 10, row: 9, noteLength: 1 }, // D4
      { col: 11, row: 12, noteLength: 1 }, // B3
      { col: 12, row: 9, noteLength: 2 }, // D4
      { col: 14, row: 12, noteLength: 2 }, // B3
      { col: 16, row: 4, noteLength: 2 }, // G4
      { col: 18, row: 5, noteLength: 1 }, // F#4
      { col: 19, row: 7, noteLength: 1 }, // E4
      { col: 20, row: 9, noteLength: 2 }, // D4
      { col: 22, row: 12, noteLength: 2 }, // B3
      { col: 24, row: 9, noteLength: 2 }, // D4
      { col: 26, row: 12, noteLength: 2 }, // B3
      { col: 28, row: 9, noteLength: 4 }, // D4 (held)
      { col: 32, row: 2, noteLength: 2 }, // A4 (peak)
      { col: 34, row: 5, noteLength: 2 }, // F#4
      { col: 36, row: 7, noteLength: 1 }, // E4
      { col: 37, row: 9, noteLength: 1 }, // D4
      { col: 38, row: 5, noteLength: 2 }, // F#4
      { col: 40, row: 7, noteLength: 2 }, // E4
      { col: 42, row: 9, noteLength: 2 }, // D4
      { col: 44, row: 5, noteLength: 2 }, // F#4
      { col: 46, row: 7, noteLength: 2 }, // E4
      { col: 48, row: 7, noteLength: 3 }, // E4
      { col: 52, row: 10, noteLength: 2 }, // C#4
      { col: 54, row: 14, noteLength: 2 }, // A3
      { col: 56, row: 12, noteLength: 2 }, // B3
      { col: 58, row: 14, noteLength: 2 }, // A3
      { col: 60, row: 10, noteLength: 2 }, // C#4
      { col: 62, row: 7, noteLength: 2 }, // E4
      { col: 0, row: 17, noteLength: 8 }, // F#3
      { col: 0, row: 21, noteLength: 8 }, // D3
      { col: 8, row: 17, noteLength: 8 }, // F#3
      { col: 8, row: 21, noteLength: 8 }, // D3
      { col: 16, row: 16, noteLength: 8 }, // G3
      { col: 16, row: 21, noteLength: 8 }, // D3
      { col: 24, row: 16, noteLength: 8 }, // G3
      { col: 24, row: 21, noteLength: 8 }, // D3
      { col: 32, row: 17, noteLength: 8 }, // F#3
      { col: 32, row: 21, noteLength: 8 }, // D3
      { col: 40, row: 17, noteLength: 8 }, // F#3
      { col: 40, row: 21, noteLength: 8 }, // D3
      { col: 48, row: 19, noteLength: 8 }, // E3
      { col: 48, row: 22, noteLength: 8 }, // C#3
      { col: 56, row: 19, noteLength: 8 }, // E3
      { col: 56, row: 22, noteLength: 8 }, // C#3
      { col: 0, row: 24, noteLength: 16 }, // B2
      { col: 16, row: 28, noteLength: 16 }, // G2
      { col: 32, row: 33, noteLength: 16 }, // D2
      { col: 48, row: 26, noteLength: 16 }, // A2
    ],
  },
};

function loadPreset(name) {
  let preset = PRESETS[name];
  if (!preset) return;
  bpm = preset.bpm;
  notes = preset.notes.map(function (d) {
    let px = PIANO_W + d.col * noteW;
    let py = HEADER_H + d.row * noteH;
    let n = new MakeNote(px, py);
    n.noteLength = d.noteLength;
    return n;
  });
}

//----- Save / Load -----//
function saveGrid() {
  let data = notes.map(function (n) {
    return { x: n.x, y: n.y, noteLength: n.noteLength };
  });
  localStorage.setItem("pianoRoll", JSON.stringify(data));
}

function loadGrid() {
  let saved = localStorage.getItem("pianoRoll");
  if (!saved) {
    return;
  }
  let data = JSON.parse(saved);
  notes = data.map(function (d) {
    let n = new MakeNote(d.x, d.y);
    n.noteLength = d.noteLength;
    return n;
  });
}

//----- Record / Export -----//
function exportSound() {
  if (!isRecording) {
    isPlaying = true;
    beat = 0;
    nextTick = millis();
    recorder.record(theFile);
    isRecording = true;
  } else {
    recorder.stop();
    isPlaying = false;
    isRecording = false;
    saveSound(theFile, "my-piano-roll.wav");
  }
}

//----- p5.js Focus / Blur handling -----//
// https://gemini.google.com/app/dea5b331aef3a90e
window.addEventListener("blur", function () {
  if (p5Canvas) {
    p5Canvas.style("filter", "blur(5px) grayscale(20%)");
    p5Canvas.style("transition", "filter 0.3s ease");
    p5Canvas.style("pointer-events", "none");
  }
});

window.addEventListener("focus", function () {
  if (p5Canvas) {
    p5Canvas.style("filter", "none");
    p5Canvas.style("pointer-events", "auto");
  }
});
