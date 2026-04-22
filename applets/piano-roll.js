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

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = height - height / 4 / size;
  cols = width - width / 4 / size;
}

function draw() {
  background(COLOR9);
  drawPianoRoll();
}

function drawPianoRoll() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      fill(COLOR5);
      noStroke();
      square(x * size, y * size, size, CORNERRADIUS);
    }
  }
}
