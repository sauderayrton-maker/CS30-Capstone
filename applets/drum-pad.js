//----- Constants -----//
//--//  look and feel  //--//
const CORNERRADIUS = 8;
const SURFACE = "#252220";
const PLAYHEAD_COLOR = "#e6c200";
const PLAYHEAD_SHADOW = "rgba(230, 194, 0, 0.15)";
const INACTIVE_DRUM_COLOR = "#1a1714";
const INACTIVE_DRUM_ALT = "#161208";
const INACTIVE_COLUMN_HIGHLIGHT = "#3a3530";
const HEADER_TEXT_ACTIVE = "#e6c200";
const HEADER_TEXT_INACTIVE = "#4d4a46";
const ACTIVE_NOTE_COLOR = "#e6c200";
const ACTIVE_NOTE_BRIGHT = "#f5e68a";
const BG = "#0f0d0a";
const COLOR_KICK = "#e6c200";
const COLOR_SNARE = "#d4a573";
const COLOR_CLAP = "#e6d960";
const COLOR_TOM = "#d47a8f";
const COLOR_HHCL = "#a8d46b";
const COLOR_HHOP = "#6ad4a4";
const COLOR_COWBELL = "#6ac4e6";
const COLOR_CRASH = "#b96ae6";
const BORDER_KICK = "#5a4a1a";
const BORDER_SNARE = "#5a3a1a";
const BORDER_CLAP = "#5a4a1a";
const BORDER_TOM = "#5a1a2e";
const BORDER_HHCL = "#3a5a1a";
const BORDER_HHOP = "#1a5a38";
const BORDER_COWBELL = "#1a3a5a";
const BORDER_CRASH = "#3a1a5a";
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
let recorder;
let currentNote = 0;
let nextNote = 0;
let kick, snare, openHat, closedHat;
let crash, clap, cowBell, tom;
let p5Canvas;
let theFile;
let isRecording = false;

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
  let renderer = createCanvas(windowWidth, windowHeight);
  p5Canvas = renderer;
  textFont("opensans");
  cols = 16;
  rows = 8;
  noteW = (width - LABEL_W - PAD * 2 - GAP * (cols - 1) - BEAT_GAP * 3) / cols;
  noteH = (height - HEADER_H - PAD * 2 - GAP * (rows - 1)) / rows;
  makeGrid(cols, rows);
  recorder = new p5.SoundRecorder();
  theFile = new p5.SoundFile();
  recorder.setInput();
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
  let interval = ((60 / bpm) * 1000) / 4;
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
  rect(0, 0, width, HEADER_H, CORNERRADIUS);
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
    } else {
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
    rect(PAD, py, 3, noteH, CORNERRADIUS / 2, 0, 0, CORNERRADIUS / 2);
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
      } else if (isPlaying && x === currentNote) {
        fill(INACTIVE_COLUMN_HIGHLIGHT);
      } else if (beatsArray[y][x] === ACTIVE_NOTE) {
        fill(colors[y]);
      } else {
        fill(floor(x / 4) % 2 === 0 ? INACTIVE_DRUM_COLOR : INACTIVE_DRUM_ALT);
      }
      if (
        beatsArray[y][x] === ACTIVE_NOTE &&
        !(isPlaying && x === currentNote)
      ) {
        stroke(borders[y]);
        strokeWeight(1);
      } else {
        noStroke();
      }
      rect(px, py, noteW, noteH, CORNERRADIUS / 2);
    }
  }
}

//----- Playhead -----//
function drawPlayhead() {
  let px = getNoteX(currentNote);
  noStroke();
  fill(PLAYHEAD_SHADOW);
  rect(px, HEADER_H, noteW, height - HEADER_H, CORNERRADIUS / 4);
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
      }
    }
  }
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveGrid();
  }
  if (key === "e" || key === "E") {
    exportSound();
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
  if (key === "5") {
    closedHat.play();
  }
  if (key === "3") {
    clap.play();
  }
  if (key === "6" || key === "O") {
    openHat.play();
  }
  if (key === "1") {
    kick.play();
  }
  if (key === "8") {
    crash.play();
  }
  if (key === "4") {
    tom.play();
  }
  if (key === "2") {
    snare.play();
  }
  if (key === "7") {
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

function exportSound() {
  if (!isRecording) {
    isPlaying = true;
    currentNote = 0;
    nextNote = millis();
    recorder.record(theFile);
    isRecording = true;
  } else {
    recorder.stop();
    isPlaying = false;
    isRecording = false;
    saveSound(theFile, "my-drum-loop.wav");
    console.log(theFile);
  }
}

//ai

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
// Drum Pad done!!! for now ;)
