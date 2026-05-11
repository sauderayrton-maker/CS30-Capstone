//----- Constants -----//
const CORNERRADIUS = 20;
const GRID_STROKE = "#181824";
const SURFACE = "#111118";
const CELL_BG = "#1a1a2e";
const PLAYHEAD_COLOR = "#2d3561";
const INACTIVE_DRUM_COLOR = "#23243a";
const ACTIVE_NOTE_COLOR = "#c8ccff";
const ACTIVE_NOTE_BRIGHT = "#e8eaff";
const BG = "#0a0a0f";
const ACTIVE_NOTE = 1;
const INACTIVE_DRUM = 0;
const HALF_NOTE = 2;
const HOLE_NOTE = 4;

//----- Variables -----//
let rows;
let cols;
let noteW;
let noteH;
let size;
let beatsArray = [];
let playing = false;
let noteSelector = ACTIVE_NOTE;
let bpm = 120;
let currentNote = 0;
let kick;
let snare;
let openHat, closedHat;

function preload() {
  kick = loadSound("assets/drums/jetson.wav");
  snare = loadSound("assets/drums/rio - guts 808.wav");
  openHat = loadSound("assets/drums/hh open.mp3");
  closedHat = loadSound("assets/drums/hh closed.mp3");
}

//----- Setup -----//
function setup() {
  createCanvas(windowWidth, windowHeight);
  noteW = width / 8;
  noteH = height / 8;
  size = (width / height) * 50;
  rows = height / noteH;
  cols = width / noteW;
  makeGrid(cols, rows);
}

//----- Making it happen -----//
function draw() {
  background(BG);
  drawDrumPad();
  if (playing) {
    play();
  }
}

//----- Timing -----//
function start() {
  console.log("ts playing now");
}

//----- Draws the Grid and Fills Colors -----//
function drawDrumPad() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (beatsArray[y][x] === ACTIVE_NOTE) {
        fill(ACTIVE_NOTE_COLOR);
      } else {
        fill(INACTIVE_DRUM_COLOR);
      }
      stroke(GRID_STROKE);
      rect(x * noteW, y * noteH, noteW, noteH, CORNERRADIUS);
    }
  }
}

//----- Creats Grid Array-----//
function makeGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    beatsArray[y] = [];
    for (let x = 0; x < cols; x++) {
      beatsArray[y][x] = INACTIVE_DRUM;
    }
  }
}

//----- Updates Grid when Clicked -----//
function toggleNote(x, y) {
  if (beatsArray[y][x] === ACTIVE_NOTE) {
    beatsArray[y][x] = INACTIVE_DRUM;
  } else {
    beatsArray[y][x] = ACTIVE_NOTE;
  }
}

//----- Keybinds -----//
function mouseClicked() {
  let x = floor(mouseX / noteW);
  let y = floor(mouseY / noteH);
  toggleNote(x, y);
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveGrid();
  }
  if (key === "l" || key === "L") {
    loadGrid();
  }

  if (key === " ") {
    playing = !playing;
  }
  if (key === "c" || key === "C") {
    makeGrid(cols, rows);
  }
  if (key === "1") {
    kick.play();
  }
  if (key === "2") {
    snare.play();
  }
  if (key === "3") {
    closedHat.play();
  }
  if (key === "4") {
    openHat.play();
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

function keepTime() {}
