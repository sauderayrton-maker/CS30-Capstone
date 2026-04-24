const CORNERRADIUS = 20;
const COLOR1 = "#582f0e";
const COLOR2 = "#7f4f24";
const COLOR3 = "#936639";
const COLOR4 = "#a68a64";
const COLOR5 = "#b6ad90";
const COLOR6 = "#c2c5aa";
const COLOR7 = "#656d4a";
const COLOR8 = "#414833";
const COLOR9 = "#333d29";
let rows;
let cols;
let noteW;
let noteH;
let size;
let notesArray = [];
const ACTIVE_NOTE = 1;
const INACTIVE_NOTE = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noteW = width / 16;
  noteH = height / 8;
  size = (width / height) * 50;
  rows = height / noteH;
  cols = width / noteW;
  makeGrid(cols, rows);
}

function draw() {
  background(COLOR9);
  drawPianoRoll();
}

function drawPianoRoll() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (notesArray[y][x] === ACTIVE_NOTE) {
        fill(COLOR7);
      } else {
        fill(COLOR5);
      }
      stroke(COLOR1);
      square(x * noteW, y * noteH, size, CORNERRADIUS);
    }
  }
}
function makeGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    notesArray[y] = [];
    for (let x = 0; x < cols; x++) {
      notesArray[y][x] = INACTIVE_NOTE;
    }
  }
}

function toggleNote(x, y) {
  if (notesArray[y][x] === ACTIVE_NOTE) {
    notesArray[y][x] = INACTIVE_NOTE;
  } else {
    notesArray[y][x] = ACTIVE_NOTE;
  }
}

function mouseClicked() {
  let x = floor(mouseX / noteW);
  let y = floor(mouseY / noteH);
  toggleNote(x, y);
}

function keyPressed() {
  if (key === "s") {
    saveGrid();
  }
}

function saveGrid() {}
