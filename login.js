const BG = "#0f0d0a";
const ACCENT = "#e6c200";
const ACCENT_BRIGHT = "#f5e68a";

let panelTiltX = 0;
let panelTiltY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Open Sans");
}

function draw() {
  background(BG);

  drawAmbientGrid();
  updateTilt();

  const panelW = 480;
  const panelH = 380;

  const panelX = width * 0.12;
  const panelY = height * 0.5 - panelH * 0.5;

  push();

  translate(panelX + panelW / 2, panelY + panelH / 2);

  drawGlassPanel(-panelW / 2, -panelH / 2, panelW, panelH);

  pop();

  drawContent(panelX, panelY, panelW, panelH);

  drawBackgroundBrand();
}

function drawContent(x, y, w, h) {
  fill(255);

  textAlign(LEFT);

  fill(ACCENT);
  textSize(52);
  textStyle(BOLD);
  text("FLUX", x + 36, y + 72);

  fill(150);
  textSize(11);
  textStyle(NORMAL);
  text("MUSIC PRODUCTION WORKSPACE", x + 38, y + 95);

  drawInput(x + 36, y + 135, w - 72, 48, "USERNAME");

  drawInput(x + 36, y + 200, w - 72, 48, "PASSWORD");

  drawButton(x + 36, y + 280, w - 72, 46, "ACCESS WORKSPACE");

  fill(120);
  textSize(10);

  text("SECURE CONNECTION ACTIVE", x + 36, y + h - 24);

  textAlign(RIGHT);

  text("BUILD 0.9.3", x + w - 36, y + h - 24);
}

function drawInput(x, y, w, h, label) {
  noStroke();

  fill(15, 15, 15, 180);
  rect(x, y, w, h, 10);

  fill(255, 10);
  rect(x + 1, y + 1, w - 2, h * 0.45, 10);

  fill(ACCENT);
  rect(x, y, 3, h, 10);

  fill(150);
  textAlign(LEFT, CENTER);
  textSize(10);

  text(label, x + 14, y + h / 2);
}

function drawButton(x, y, w, h, label) {
  const hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

  noStroke();

  fill(hover ? ACCENT_BRIGHT : ACCENT);
  rect(x, y, w, h, 10);

  fill(255, hover ? 35 : 18);
  rect(x + 1, y + 1, w - 2, h * 0.45, 10);

  fill("#111");

  textAlign(CENTER, CENTER);
  textSize(11);

  text(label, x + w / 2, y + h / 2);
}

function drawGlassPanel(x, y, w, h) {
  push();

  noStroke();

  fill(0, 70);
  rect(x + 10, y + 14, w, h, 18);

  fill(32, 28, 24, 215);
  stroke(255, 22);
  strokeWeight(1);

  rect(x, y, w, h, 18);

  noStroke();

  fill(255, 18);

  beginShape();
  vertex(x + 2, y + 2);
  vertex(x + w - 2, y + 2);
  vertex(x + w - 30, y + h * 0.3);
  vertex(x + 25, y + h * 0.15);
  endShape(CLOSE);

  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;

  fill(255, 12);

  ellipse(dx * 0.05, dy * 0.05, 260, 260);

  stroke(230, 194, 0, 18);
  noFill();

  rect(x + 1, y + 1, w - 2, h - 2, 18);

  pop();
}

function drawAmbientGrid() {
  stroke(255, 5);

  const spacing = 52;

  let ox = sin(frameCount * 0.002) * 12;
  let oy = cos(frameCount * 0.002) * 12;

  for (let x = -spacing; x < width + spacing; x += spacing) {
    line(x + ox, 0, x + ox, height);
  }

  for (let y = -spacing; y < height + spacing; y += spacing) {
    line(0, y + oy, width, y + oy);
  }
}

function drawBackgroundBrand() {
  push();

  textAlign(RIGHT, CENTER);

  fill(255, 8);

  textSize(width * 0.18);

  text("FLUX", width - 60, height * 0.52);

  pop();
}

function updateTilt() {
  const tx = map(mouseY, 0, height, -2, 2);

  const ty = map(mouseX, 0, width, 2, -2);

  panelTiltX = lerp(panelTiltX, tx, 0.08);
  panelTiltY = lerp(panelTiltY, ty, 0.08);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
