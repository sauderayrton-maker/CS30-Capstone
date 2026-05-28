//----- Constants -----//
const CORNERRADIUS = 8;
const SURFACE = "#141210";
const PLAYHEAD_COLOR = "#f5d48a";
const PLAYHEAD_SHADOW = "rgba(255, 220, 100, 0.05)";
const ACTIVE_COLOR = "#e8a94a";
const ACTIVE_BRIGHT = "#f5d48a";
const ACTIVE_BORDER = "#7a4e18";
const INACTIVE_NATURAL = "#1e1a14";
const INACTIVE_SHARP = "#161310";
const INACTIVE_NATURAL2 = "#1c1814";
const INACTIVE_SHARP2 = "#131110";
const INACTIVE_COL_HIGHLIGHT = "#252015";
const HEADER_TEXT_ACTIVE = "#e8a94a";
const HEADER_TEXT_INACTIVE = "#2e2820";
const STROKE = "#1e1a14";
const BG = "#0c0a08";
const PIANO_W = 68;
const HEADER_H = 36;
const PAD = 8;
const OCTAVES = 5;
const COLS = 64;
const HIGHEST = 95;

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
];
let blackKeys = [1, 3, 5, 8, 10];

//----- Grid & State Variables -----//
let rows = OCTAVES * 12;
let noteW, noteH;
let notes = [];
let isPlaying = false;
let bpm = 120;
let currentBeat = 0;
let nextBeat = 0;
let waveIndex = 0;
let hoveredNote = null;

//----- Setup -----//
function setup() {
  createCanvas(windowWidth, windowHeight);
  noteH = (height - HEADER_H) / rows;
  noteW = (width - PIANO_W) / COLS;
}

//----- Draw  -----//
function draw() {
  background(BG);
  drawHeader();
  drawGrid();
  drawPiano();
}

//----- Header -----//
function drawHeader() {
  noStroke();
  fill(SURFACE);
  rect(0, 0, width, HEADER_H);
  fill(HEADER_TEXT_ACTIVE);
  textSize(11);
  textAlign(LEFT, CENTER);
  text(bpm + " BPM  ", PAD, HEADER_H / 2);
  textAlign(CENTER, CENTER);
  for (let x = 0; x < COLS; x++) {
    let px = PIANO_W + x * noteW + noteW / 2;
    if (x % 16 === 0) {
      fill(HEADER_TEXT_ACTIVE);
      textSize(11);
      text(floor(x / 16) + 1, px, HEADER_H / 2);
    } else if (x % 4 === 0) {
      fill(HEADER_TEXT_INACTIVE);
      textSize(9);
      text((floor(x / 4) % 4) + 1, px, HEADER_H / 2);
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
      if (isPlaying && x === currentBeat) {
        fill(INACTIVE_COL_HIGHLIGHT);
      } else {
        let evenGroup = floor(x / 4) % 2 === 0;
        if (isSharp) {
          fill(evenGroup ? INACTIVE_SHARP : INACTIVE_SHARP2);
        } else {
          fill(evenGroup ? INACTIVE_NATURAL : INACTIVE_NATURAL2);
        }
      }
      noStroke();
      rect(px, py, noteW, noteH);
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
    fill(isBlack ? "#0e0c0a" : SURFACE);
    stroke(STROKE);
    strokeWeight(0.5);
    rect(0, py, PIANO_W, noteH);
    if (isBlack) {
      noStroke();
      fill("#09090a");
      rect(0, py, PIANO_W * 0.6, noteH);
    }
    if (noteIndex === 11) {
      fill(ACTIVE_COLOR);
      noStroke();
      textSize(9);
      textAlign(RIGHT, CENTER);
      text("C" + octave, PIANO_W - 5, py + noteH / 2);
    }
  }
  noStroke();
  fill(SURFACE);
  rect(0, 0, PIANO_W, HEADER_H);
  stroke(STROKE);
  strokeWeight(1);
  line(PIANO_W, 0, PIANO_W, height);
  line(0, HEADER_H, PIANO_W, HEADER_H);
}
//----- Window Resize -----//
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noteH = (height - HEADER_H) / rows;
  noteW = (width - PIANO_W) / COLS;
}
