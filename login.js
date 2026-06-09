const BACKGROUND = "#0f0d0a";
const TILE_DARK = "#1a1714";
const TILE_DARKER = "#161208";
const GOLD = "#e6c200";
const GRAY = "#4d4a46";

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

let userInput, passInput, loginBtn, createBtn, logoImg, canvas;
let tiles = [],
  tileSize = 50,
  cols,
  rows;

function preload() {
  logoImg = loadImage("logoround.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  textFont("Open Sans");
  buildGrid();
  buildForm();
}

function draw() {
  background(BACKGROUND);
  rectMode(CORNER);
  for (let t of tiles) {
    t.update();
    t.display();
  }
  drawPanel();
  drawLogo();
}

function panelWidth() {
  return floor(width / 3 / tileSize) * tileSize;
}
function formWidth() {
  return min(280, panelWidth() - 80);
}
function formLeft() {
  return panelWidth() / 2 - formWidth() / 2;
}
function centerY() {
  return height / 2;
}

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

function buildForm() {
  userInput = createInput("");
  userInput.attribute("placeholder", "USERNAME");
  styleInput(userInput, formLeft(), centerY() - 90, formWidth());

  passInput = createInput("", "password");
  passInput.attribute("placeholder", "PASSWORD");
  styleInput(passInput, formLeft(), centerY() + 30, formWidth());

  loginBtn = createButton("INITIALIZE SESSION");
  loginBtn.position(formLeft(), centerY() + 125);
  loginBtn.size(formWidth(), 46);
  loginBtn.style("background", "rgba(30, 25, 15, 0.9)");
  loginBtn.style("border", "1px solid #3a3530");
  loginBtn.style("color", GOLD);
  loginBtn.style("border-radius", "5px");
  loginBtn.style("font-family", '"Open Sans", sans-serif');
  loginBtn.style("font-weight", "600");
  loginBtn.style("cursor", "pointer");

  loginBtn.mouseOver(setButtonActive);
  loginBtn.mouseOut(setButtonInactive);
  loginBtn.mousePressed(login);

  createBtn = createButton("CREATE USER");
  createBtn.position(formLeft(), centerY() + 180);
  createBtn.size(formWidth(), 46);
  createBtn.style("background", "rgba(30, 25, 15, 0.9)");
  createBtn.style("border", "1px solid #3a3530");
  createBtn.style("color", GRAY);
  createBtn.style("border-radius", "5px");
  createBtn.style("font-family", '"Open Sans", sans-serif');
  createBtn.style("font-weight", "600");
  createBtn.style("cursor", "pointer");
  createBtn.mousePressed(createUser);
}

function setButtonActive() {
  loginBtn.style("background", GOLD);
  loginBtn.style("color", BACKGROUND);
}

function setButtonInactive() {
  loginBtn.style("background", "rgba(30, 25, 15, 0.9)");
  loginBtn.style("color", GOLD);
}

function styleInput(input, x, y, w) {
  input.position(x, y);
  input.size(w, 20);
  input.style("background", "rgba(25, 22, 18, 0.9)");
  input.style("border", "1px solid #3a3530");
  input.style("border-radius", "5px");
  input.style("padding", "12px 14px");
  input.style("color", GOLD);
}

function drawPanelShape() {
  let right = panelWidth();
  let stepSize = tileSize * 4;
  beginShape();
  vertex(0, 0);
  vertex(right, 0);
  for (let y = stepSize; y < height; y += stepSize * 2) {
    vertex(right, y);
    vertex(right - tileSize, y);
    vertex(right - tileSize, min(y + stepSize, height));
    vertex(right, min(y + stepSize, height));
  }
  vertex(right, height);
  vertex(0, height);
  endShape(CLOSE);
}

function getEdgePoints() {
  let right = panelWidth();
  let stepSize = tileSize * 4;
  let points = [{ x: right, y: 0 }];
  for (let y = stepSize; y < height; y += stepSize * 2) {
    points.push(
      { x: right, y: y },
      { x: right - tileSize, y: y },
      { x: right - tileSize, y: min(y + stepSize, height) },
      { x: right, y: min(y + stepSize, height) },
    );
  }
  points.push({ x: right, y: height });
  return points;
}

// ---- makes pannel ----- //
function drawPanel() {
  noStroke();
  fill(15, 12, 10, 240);
  drawPanelShape();
  fill(GOLD);
  text("FLUX LOGIN", 40, 24);
  text("USER NAME", 40, centerY() - 95);
  text("PASSWORD", 40, centerY() + 25);
}

function drawLogo() {
  if (!logoImg) {
    return;
  }
  imageMode(CENTER);
  image(
    logoImg,
    panelWidth() + (width - panelWidth()) / 2,
    height / 2,
    260,
    260,
  );
}

class Tile {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.baseColor =
      floor(col / 4) % 2 === 0 ? color(TILE_DARK) : color(TILE_DARKER);
    this.currentColor = this.baseColor;
    this.glowColor = color(random(COLORS));
    this.charge = 0;
  }

  update() {
    let d = dist(mouseX, mouseY, this.x + tileSize / 2, this.y + tileSize / 2);
    if (d < 100) {
      this.charge = map(d, 0, 100, 1, 0);
    } else {
      this.charge = max(0, this.charge - 0.04);
    }
    this.currentColor = lerpColor(this.baseColor, this.glowColor, this.charge);
  }

  display() {
    noStroke();
    fill(this.currentColor);
    rect(this.x + 2, this.y + 2, tileSize - 4, tileSize - 4, 4);
  }
}

function login() {
  let user = userInput.value().trim();
  let pass = passInput.value();
  let users = JSON.parse(localStorage.getItem("flux_users") || "{}");
  if (users[user] === pass) {
    sessionStorage.setItem("flux_auth", true);
    window.location.replace("index.html");
  }
}

function createUser() {
  let user = userInput.value().trim();
  let pass = passInput.value();
  if (!user || !pass) {
    return;
  }
  let users = JSON.parse(localStorage.getItem("flux_users") || "{}");
  users[user] = pass;
  localStorage.setItem("flux_users", JSON.stringify(users));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
