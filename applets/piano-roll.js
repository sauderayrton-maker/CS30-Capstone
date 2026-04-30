//----- Constants -----//
const CORNERRADIUS = 20;
const GRID_STROKE = "#181824";
const SURFACE = "#111118";
const CELL_BG = "#1a1a2e";
const PLAYHEAD_COLOR = "#2d3561";
const INACTIVE_NOTE_COLOR = "#23243a";
const ACTIVE_NOTE_COLOR = "#c8ccff";
const ACTIVE_NOTE_BRIGHT = "#e8eaff";
const BG = "#0a0a0f";
const ACTIVE_NOTE = 1;
const INACTIVE_NOTE = 0;
const HALF_NOTE = 2;
const HOLE_NOTE = 4;

//----- Variables -----//
let rows;
let cols;
let noteW;
let noteH;
let size;
let notesArray = [];
let playing = false;
let noteSelector = ACTIVE_NOTE;
let bpm = 120;
let currentNote = 0;

//----- Setup -----//
function setup() {
  createCanvas(windowWidth, windowHeight);
  noteW = width / 16;
  noteH = height / 8;
  size = (width / height) * 50;
  rows = height / noteH;
  cols = width / noteW;
  makeGrid(cols, rows);
}

//----- Making it happen -----//
function draw() {
  background(BG);
  drawPianoRoll();
  if (playing) {
    play();
  }
}

//----- Timing -----//
function play() {
  console.log("ts playing now");
}

//----- Draws the Grid and Fills Colors -----//
function drawPianoRoll() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (notesArray[y][x] === ACTIVE_NOTE) {
        fill(ACTIVE_NOTE_COLOR);
      } else {
        fill(INACTIVE_NOTE_COLOR);
      }
      stroke(GRID_STROKE);
      rect(x * noteW, y * noteH, noteW, noteH, CORNERRADIUS);
    }
  }
}

//----- Creats Grid Array-----//
function makeGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    notesArray[y] = [];
    for (let x = 0; x < cols; x++) {
      notesArray[y][x] = INACTIVE_NOTE;
    }
  }
}

//----- Updates Grid when Clicked -----//
function toggleNote(x, y) {
  if (notesArray[y][x] === ACTIVE_NOTE) {
    notesArray[y][x] = INACTIVE_NOTE;
  } else {
    notesArray[y][x] = ACTIVE_NOTE;
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
    noteSelector = ACTIVE_NOTE;
  }
  if (key === "2") {
    noteSelector = HALF_NOTE;
  }
  if (key === "4") {
    noteSelector = HOLE_NOTE;
  }
}

//----- Saves grid to local storage -----//
function saveGrid() {
  localStorage.setItem("pianoRoll", JSON.stringify(notesArray));
}

//----- Loads grid to use again -----//
function loadGrid() {
  let saved = localStorage.getItem("pianoRoll");
  if (saved) {
    notesArray = JSON.parse(saved);
  }
}

function keepTime() {}
