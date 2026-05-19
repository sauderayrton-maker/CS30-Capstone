//----- Constants -----//
//--//  look and feel  //--//
const CORNERRADIUS = 8;
const SURFACE = "#141210";
const PLAYHEAD_COLOR = "#f5d48a";
const PLAYHEAD_SHADOW = "rgba(255, 220, 100, 0.05)";
const INACTIVE_DRUM_COLOR = "#1e1a14";
const INACTIVE_DRUM_ALT = "#1a1710";
const INACTIVE_COLUMN_HIGHLIGHT = "#252015";
const HEADER_TEXT_ACTIVE = "#e8a94a";
const HEADER_TEXT_INACTIVE = "#2e2820";
const ACTIVE_NOTE_COLOR = "#e8a94a";
const ACTIVE_NOTE_BRIGHT = "#f5d48a";
const BG = "#0c0a08";
const COLOR_KICK = "#e8a94a";
const COLOR_SNARE = "#e8704a";
const COLOR_CLAP = "#e8c44a";
const COLOR_TOM = "#e84a7a";
const COLOR_HHCL = "#a4e84a";
const COLOR_HHOP = "#4ae8a4";
const COLOR_COWBELL = "#4ab4e8";
const COLOR_CRASH = "#b44ae8";
const BORDER_KICK = "#3d2a0a";
const BORDER_SNARE = "#3d1a0a";
const BORDER_CLAP = "#3d320a";
const BORDER_TOM = "#3d0a1e";
const BORDER_HHCL = "#283d0a";
const BORDER_HHOP = "#0a3d28";
const BORDER_COWBELL = "#0a2c3d";
const BORDER_CRASH = "#2c0a3d";
const LABEL_W = 88;
const HEADER_H = 36;
const PAD = 8;
const GAP = 4;
const BEAT_GAP = 10;

//--//  State  //--//
const ACTIVE_NOTE = 1;
const INACTIVE_DRUM = 0;

//----- Variables -----//
//--//  rows setup  //--//
let labels = [
  "KICK",
  "SNARE",
  "CLAP",
  "TOM",
  "HH CL",
  "HH OP",
  "COWBELL",
  "CRASH",
];
let colors = [
  COLOR_KICK,
  COLOR_SNARE,
  COLOR_CLAP,
  COLOR_TOM,
  COLOR_HHCL,
  COLOR_HHOP,
  COLOR_COWBELL,
  COLOR_CRASH,
];
let borders = [
  BORDER_KICK,
  BORDER_SNARE,
  BORDER_CLAP,
  BORDER_TOM,
  BORDER_HHCL,
  BORDER_HHOP,
  BORDER_COWBELL,
  BORDER_CRASH,
];

//--//  General  //--//
let rows;
let cols;
let noteW;
let noteH;
let beatsArray = [];
let isPlaying = false;
let bpm = 120;
let currentNote = 0;
let nextNote = 0;
let kick, snare, openHat, closedHat;
let crash, clap, cowBell, tom;

//--//  Preloads  //--//
function preload() {
  kick = loadSound("assets/drums/kick-808.wav");
  snare = loadSound("assets/drums/snare-lofi01.wav");
  openHat = loadSound("assets/drums/openhat-slick.wav");
  closedHat = loadSound("assets/drums/hihat-808.wav");
  crash = loadSound("assets/drums/crash-808.wav");
  clap = loadSound("assets/drums/clap-808.wav");
  cowBell = loadSound("assets/drums/cowbell-808.wav");
  tom = loadSound("assets/drums/tom-808.wav");
}

//----- Setup -----//
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("opensans");
  cols = 16;
  rows = 8;
  noteW = (width - LABEL_W - PAD * 2 - GAP * (cols - 1) - BEAT_GAP * 3) / cols;
  noteH = (height - HEADER_H - PAD * 2 - GAP * (rows - 1)) / rows;
  makeGrid(cols, rows);
}

//----- Making it happen -----//
function draw() {
  background(BG);
  drawHeader();
  drawLabels();
  drawDrumPad();
  if (isPlaying) {
    start();
    drawPlayhead();
  }
  textSize(30);
  textAlign(CENTER, CENTER);
}

//----- Timing -----//
function start() {
  let interval = 60 / bpm * 1000 / 4;
  if (millis() >= nextNote) {
    lightColumn(currentNote);
    currentNote = (currentNote + 1) % cols;
    nextNote = millis() + interval;
  }
}

//--//  goes through each col and plays sound if note  //--//
function lightColumn(col) {
  if (beatsArray[0][col] === ACTIVE_NOTE) {
    kick.play();
  }
  if (beatsArray[1][col] === ACTIVE_NOTE) {
    snare.play();
  }
  if (beatsArray[2][col] === ACTIVE_NOTE) {
    clap.play();
  }
  if (beatsArray[3][col] === ACTIVE_NOTE) {
    tom.play();
  }
  if (beatsArray[4][col] === ACTIVE_NOTE) {
    closedHat.play();
  }
  if (beatsArray[5][col] === ACTIVE_NOTE) {
    openHat.play();
  }
  if (beatsArray[6][col] === ACTIVE_NOTE) {
    cowBell.play();
  }
  if (beatsArray[7][col] === ACTIVE_NOTE) {
    crash.play();
  }
}

//----- Header -----//
function drawHeader() {
  noStroke();
  fill(SURFACE);
  rect(0, 0, width, HEADER_H);
  fill(HEADER_TEXT_ACTIVE);
  textSize(11);
  textAlign(LEFT, CENTER);
  text(bpm + " BPM", PAD + 6, HEADER_H / 2);
  textAlign(CENTER, CENTER);
  for (let x = 0; x < cols; x++) {
    let px = getNoteX(x) + noteW / 2;
    if (x % 4 === 0) {
      fill(HEADER_TEXT_ACTIVE);
      textSize(11);
      text(floor(x / 4) + 1, px, HEADER_H / 2);
    } 
    else {
      fill(HEADER_TEXT_INACTIVE);
      textSize(9);
      text(x + 1, px, HEADER_H / 2);
    }
  }
}

//----- Labels -----//
function drawLabels() {
  for (let y = 0; y < rows; y++) {
    let py = getNoteY(y);
    noStroke();
    fill(SURFACE);
    rect(PAD, py, LABEL_W - PAD * 2, noteH, CORNERRADIUS);
    fill(colors[y]);
    rect(PAD, py, 3, noteH, CORNERRADIUS, 0, 0, CORNERRADIUS);
    fill(colors[y]);
    textSize(9);
    textAlign(LEFT, CENTER);
    text(labels[y], PAD + 10, py + noteH / 2);
  }
}

//----- Draws the Grid and Fills Colors -----//
function drawDrumPad() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = getNoteX(x);
      let py = getNoteY(y);
      if (isPlaying && x === currentNote && beatsArray[y][x] === ACTIVE_NOTE) {
        fill(ACTIVE_NOTE_BRIGHT);
      } 
      else if (isPlaying && x === currentNote) {
        fill(INACTIVE_COLUMN_HIGHLIGHT);
      } 
      else if (beatsArray[y][x] === ACTIVE_NOTE) {
        fill(colors[y]);
      } 
      else {
        fill(floor(x / 4) % 2 === 0 ? INACTIVE_DRUM_COLOR : INACTIVE_DRUM_ALT);
      }
      if (
        beatsArray[y][x] === ACTIVE_NOTE &&
        !(isPlaying && x === currentNote)
      ) {
        stroke(borders[y]);
        strokeWeight(1);
      } 
      else {
        noStroke();
      }
      rect(px, py, noteW, noteH, CORNERRADIUS);
    }
  }
}

//----- Playhead -----//
function drawPlayhead() {
  let px = getNoteX(currentNote);
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

//----- Note Position Helpers -----//
function getNoteX(x) {
  return LABEL_W + PAD + x * (noteW + GAP) + floor(x / 4) * (BEAT_GAP - GAP);
}

function getNoteY(y) {
  return HEADER_H + PAD + y * (noteH + GAP);
}

//----- Creates Grid Array -----//
function makeGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    beatsArray[y] = [];
    for (let x = 0; x < cols; x++) {
      beatsArray[y][x] = INACTIVE_DRUM;
    }
  }
}

//----- Updates Grid when Clicked -----//
// function toggleNote(x, y) {
//   if (beatsArray[y][x] === ACTIVE_NOTE) {
//     beatsArray[y][x] = INACTIVE_DRUM;
//   } else {
//     beatsArray[y][x] = ACTIVE_NOTE;
//   }
// }

function toggleNote(x, y) {
  beatsArray[y][x] =
    beatsArray[y][x] === ACTIVE_NOTE ? INACTIVE_DRUM : ACTIVE_NOTE;
}

//----- Keybinds -----//
function mouseClicked() {
  if (mouseY < HEADER_H || mouseX < LABEL_W) {
    return;
  }
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let px = getNoteX(x);
      let py = getNoteY(y);
      if (
        mouseX >= px &&
        mouseX < px + noteW &&
        mouseY >= py &&
        mouseY < py + noteH
      ) {
        toggleNote(x, y);
        return;
      }
    }
  }
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveGrid();
  }
  if (key === "l" || key === "L") {
    loadGrid();
  }
  if (key === "c" || key === "C") {
    makeGrid(cols, rows);
  }
  if (key === " ") {
    isPlaying = !isPlaying;
    if (isPlaying) {
      currentNote = 0;
      nextNote = millis();
    }
  }
  if (keyCode === UP_ARROW) {
    bpm = min(bpm + 5, 300);
  }
  if (keyCode === DOWN_ARROW) {
    bpm = max(bpm - 5, 40);
  }
  if (key === "h" || key === "H") {
    closedHat.play();
  }
  if (key === "c" || key === "C") {
    clap.play();
  }
  if (key === "o" || key === "O") {
    openHat.play();
  }
  if (key === "k" || key === "K") {
    kick.play();
  }
  if (key === "r" || key === "R") {
    crash.play();
  }
  if (key === "t" || key === "T") {
    tom.play();
  }
  if (key === "s" || key === "S") {
    snare.play();
  }
  if (key === "b" || key === "B") {
    cowBell.play();
  }
}

//----- Saves grid to local storage -----//
function saveGrid() {
  localStorage.setItem("drumPad", JSON.stringify(beatsArray));
}

//----- Loads grid to use again -----//
function loadGrid() {
  let saved = localStorage.getItem("drumPad");
  if (saved) {
    beatsArray = JSON.parse(saved);
  }
}

//----- Resize -----//
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noteW = (width - LABEL_W - PAD * 2 - GAP * (cols - 1) - BEAT_GAP * 3) / cols;
  noteH = (height - HEADER_H - PAD * 2 - GAP * (rows - 1)) / rows;
}

// Drum Pad done!!! for now ;)
