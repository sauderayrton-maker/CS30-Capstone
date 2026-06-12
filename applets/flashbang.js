//----- Constants -----//
//--//  look and feel  //--//
const BACKGROUND = "#0f0d0a";
const TILE_DARK = "#1a1714";
const TILE_DARKER = "#161208";
const COLORS = [
  "#e6c200",
  "#d4a573",
  "#e6d960",
  "#d47a8f",
  "#a8d46b",
  "#6ad4a4",
  "#6ac4e6",
  "#b96ae6",
];

//----- Variables -----//
let brightness = 255;
let tiles = [],
  tileSize = 50,
  cols,
  rows;

//----- Setup -----//
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Open Sans");
  buildGrid();
}

//----- Making it happen -----//
function draw() {
  background(BACKGROUND);
  for (let t of tiles) {
    t.update();
    t.display();
  }
  words();
  changeColor();
}

//----- Grid -----//
function buildGrid() {
  tiles = [];
  cols = ceil(width / tileSize);
  rows = ceil(height / tileSize);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      tiles.push(new Tile(x * tileSize, y * tileSize, x));
    }
  }
}

//----- Fade Out -----//
function changeColor() {
  if (brightness > 0) {
    brightness -= 0.5;
  }
}

//----- Text -----//
function words() {
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(72);
  fill(255);
  text("EWWWWWWW", width / 2, height / 2 - 50);
  textSize(18);
  fill(200);
  text(" click to go back.", width / 2, height / 2 + 30);
}

//----- Tile Class -----//
class Tile {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.baseColor =
      floor(col / 4) % 2 === 0 ? color(TILE_DARK) : color(TILE_DARKER);
    this.glowColor = color(random(COLORS));
    this.charge = 0;
  }

  update() {
    let d = dist(mouseX, mouseY, this.x + tileSize / 2, this.y + tileSize / 2);
    if (d < 100) {
      this.charge = map(d, 0, 100, 1, 0);
    } 
    else {
      this.charge = max(0, this.charge - 0.04);
    }
  }

  display() {
    let dark = lerpColor(this.baseColor, this.glowColor, this.charge);
    let fade = map(brightness, 255, 0, 0, 1);
    noStroke();
    fill(lerpColor(color(brightness), dark, fade));
    rect(this.x + 2, this.y + 2, tileSize - 4, tileSize - 4, 4);
  }
}

//----- Mouse Handler -----//
function mousePressed() {
  history.back();
}

//----- Resize -----//
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
