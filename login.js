// ── Palette ─────────────────────────────────────────────────────────────────
const BG = "#0f0d0a";
const ACCENT = "#e6c200";
const BORDER = "#3a3530";
const TEXT_DIM = "#4d4a46";
const TEXT_MED = "#6a6258";

// ── Layout ───────────────────────────────────────────────────────────────────
const MARGIN = 40;
const PANEL_W = 500;

// ── State ────────────────────────────────────────────────────────────────────
let loginState = "idle"; // idle | loading | error | success
let loginTimer = 0;
let errorMsg = "";

// ── DOM inputs ────────────────────────────────────────────────────────────────
let usernameInput, passwordInput;
let activeField = null; // "user" | "pass" | null

// ── Visualizer ────────────────────────────────────────────────────────────────
const BAR_COUNT = 54;
let barPhases = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Open Sans");

  for (let i = 0; i < BAR_COUNT; i++) barPhases.push(random(TWO_PI));

  usernameInput = createInput("");
  usernameInput.attribute("autocomplete", "username");
  usernameInput.attribute("spellcheck", "false");
  styleInput(usernameInput);

  passwordInput = createInput("", "password");
  passwordInput.attribute("autocomplete", "current-password");
  styleInput(passwordInput);

  usernameInput.elt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });
  passwordInput.elt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });
  usernameInput.elt.addEventListener("focus", () => (activeField = "user"));
  passwordInput.elt.addEventListener("focus", () => (activeField = "pass"));
  usernameInput.elt.addEventListener("blur", () => {
    if (activeField === "user") activeField = null;
  });
  passwordInput.elt.addEventListener("blur", () => {
    if (activeField === "pass") activeField = null;
  });
}

function styleInput(inp) {
  inp.style("position", "absolute");
  inp.style("background", "transparent");
  inp.style("border", "none");
  inp.style("color", "#cfc7b0");
  inp.style("font-family", "'Open Sans', sans-serif");
  inp.style("font-size", "14px");
  inp.style("letter-spacing", "0.1em");
  inp.style("padding", "0 20px");
  inp.style("outline", "none");
  inp.style("caret-color", ACCENT);
  inp.style("box-sizing", "border-box");
  inp.style("z-index", "10");
}

// ── Main draw ─────────────────────────────────────────────────────────────────
function draw() {
  background(BG);

  const ph = height - MARGIN * 2;
  const px = MARGIN;
  const py = MARGIN;

  placeInputs(px, py);

  drawGrid();
  drawRightSide(px + PANEL_W, py, width - PANEL_W - MARGIN * 2, ph);
  drawGlassPanel(px, py, PANEL_W, ph);
  drawContent(px, py, PANEL_W, ph);
  drawOverlay(px, py, PANEL_W, ph);
}

// ── Scrolling ambient grid ────────────────────────────────────────────────────
function drawGrid() {
  stroke(255, 5);
  strokeWeight(1);
  const sp = 52;
  const ox = sin(frameCount * 0.002) * 12;
  const oy = cos(frameCount * 0.002) * 12;
  for (let x = -sp; x < width + sp; x += sp) line(x + ox, 0, x + ox, height);
  for (let y = -sp; y < height + sp; y += sp) line(0, y + oy, width, y + oy);
  noStroke();
}

// ── Right decorative region ───────────────────────────────────────────────────
function drawRightSide(rx, ry, rw, rh) {
  // Ghost brand wordmark
  push();
  noStroke();
  textStyle(BOLD);
  textAlign(RIGHT, BOTTOM);
  textSize(min(rw * 0.72, rh * 0.54));
  fill(255, 6);
  text("FLUX", rx + rw - 16, ry + rh - 16);
  pop();

  noStroke();
  textStyle(NORMAL);

  // ── Stats block ──
  const statY = ry + rh * 0.09;
  drawStat(rx + rw * 0.08, statY, "SAMPLE RATE", "44 100 Hz");
  drawStat(rx + rw * 0.08, statY + 56, "BIT DEPTH", "24-bit");
  drawStat(rx + rw * 0.53, statY, "LATENCY", "< 5 ms");
  drawStat(rx + rw * 0.53, statY + 56, "FORMAT", "WAV / MP3");

  // Divider
  stroke(BORDER);
  strokeWeight(1);
  line(rx + 20, ry + rh * 0.29, rx + rw - 20, ry + rh * 0.29);
  noStroke();

  // ── Frequency spectrum ──
  const cx = rx + rw / 2;
  const topY = ry + rh * 0.35;
  const botY = ry + rh * 0.7;
  const maxH = botY - topY;
  const barW = 5;
  const barGap = 4;
  const totalW = BAR_COUNT * (barW + barGap) - barGap;
  const bx = cx - totalW / 2;

  // Spectrum label
  fill(TEXT_DIM);
  textAlign(CENTER, BOTTOM);
  textSize(9);
  text("FREQUENCY SPECTRUM", cx, topY - 10);

  // Bars
  noStroke();
  for (let i = 0; i < BAR_COUNT; i++) {
    barPhases[i] += 0.04 + i * 0.0014;
    const amp = abs(sin(barPhases[i])) * abs(sin(barPhases[i] * 0.37 + 1.1));
    const bh = amp * maxH + 3;
    const alph = map(bh, 3, maxH, 25, 210);
    fill(230, 194, 0, alph);
    rect(bx + i * (barW + barGap), botY - bh, barW, bh, 2, 2, 0, 0);
  }

  // Baseline
  stroke(BORDER);
  strokeWeight(1);
  line(bx - 6, botY + 1, bx + totalW + 6, botY + 1);
  noStroke();

  // ── Bottom divider ──
  stroke(BORDER);
  line(rx + 20, ry + rh * 0.75, rx + rw - 20, ry + rh * 0.75);
  noStroke();

  // Decorative hex-grid dots (far right corner ornament)
  drawDotGrid(rx + rw - 100, ry + rh * 0.78, 80, rh * 0.18);
}

function drawStat(x, y, label, value) {
  noStroke();
  fill(TEXT_DIM);
  textAlign(LEFT, TOP);
  textSize(9);
  text(label, x, y);
  fill(ACCENT);
  textSize(18);
  textStyle(BOLD);
  text(value, x, y + 14);
  textStyle(NORMAL);
}

function drawDotGrid(x, y, w, h) {
  const spacing = 14;
  noStroke();
  for (let dx = 0; dx < w; dx += spacing) {
    for (let dy = 0; dy < h; dy += spacing) {
      const pulse = 0.4 + sin(frameCount * 0.03 + dx * 0.2 + dy * 0.2) * 0.3;
      fill(230, 194, 0, pulse * 45);
      ellipse(x + dx, y + dy, 2.5, 2.5);
    }
  }
}

// ── Glass panel shell ─────────────────────────────────────────────────────────
function drawGlassPanel(x, y, w, h) {
  push();
  noStroke();

  // Layered drop shadow for depth
  fill(0, 60);
  rect(x + 22, y + 26, w, h, 18);
  fill(0, 80);
  rect(x + 10, y + 12, w, h, 18);

  // Main body
  fill(22, 18, 14, 240);
  stroke(255, 11);
  strokeWeight(1);
  rect(x, y, w, h, 16);

  // Left accent stripe (4px amber)
  noStroke();
  fill(ACCENT);
  rect(x, y + 16, 4, h - 32);
  // Rounded caps on stripe
  fill(ACCENT);
  ellipse(x + 2, y + 16, 4, 4);
  ellipse(x + 2, y + h - 16, 4, 4);

  // Top specular highlight (glassy trapezoid)
  fill(255, 15);
  beginShape();
  vertex(x + 4, y + 2);
  vertex(x + w - 2, y + 2);
  vertex(x + w - 2, y + h * 0.19);
  vertex(x + 4, y + h * 0.1);
  endShape(CLOSE);

  // Secondary subtle band
  fill(255, 5);
  rect(x + 4, y + h * 0.19, w - 5, 1);

  // Mouse parallax inner glow
  const rx = constrain(mouseX - x, 0, w);
  const ry = constrain(mouseY - y, 0, h);
  fill(255, 7);
  ellipse(x + rx * 0.45 + w * 0.3, y + ry * 0.35, 360, 240);

  // Inner amber frame
  noFill();
  stroke(230, 194, 0, 9);
  strokeWeight(1);
  rect(x + 1, y + 1, w - 2, h - 2, 16);

  pop();
}

// ── Panel content ─────────────────────────────────────────────────────────────
function drawContent(x, y, w, h) {
  const lx = x + 48;
  const rr = x + w - 48;
  const slotW = w - 96;

  noStroke();

  // FLUX wordmark
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(88);
  fill(ACCENT);
  text("FLUX", lx, y + 40);

  // Subtitle
  textStyle(NORMAL);
  textSize(10);
  fill(TEXT_MED);
  text("MUSIC PRODUCTION WORKSPACE", lx + 2, y + 140);

  // Divider
  stroke(BORDER);
  strokeWeight(1);
  line(lx, y + 158, rr, y + 158);
  noStroke();

  // Section label
  textAlign(LEFT, TOP);
  textSize(9);
  fill(TEXT_DIM);
  text("SIGN IN TO CONTINUE", lx, y + 172);

  // Input slots
  drawSlot(lx, y + 194, slotW, 64, "USERNAME", activeField === "user");
  drawSlot(lx, y + 272, slotW, 64, "PASSWORD", activeField === "pass");

  // Login button
  const disabled = loginState === "loading" || loginState === "success";
  drawBtn(lx, y + 358, slotW, 58, "ACCESS WORKSPACE", disabled);

  // Register link
  textAlign(CENTER, CENTER);
  textSize(10);
  fill(40, 36, 30);
  text("NEW USER?  CREATE ACCOUNT", x + w / 2, y + 444);

  // Footer row
  textAlign(LEFT, BOTTOM);
  textSize(9);
  fill(38, 34, 28);
  text("SECURE CONNECTION", lx, y + h - 20);

  // Animated pulse dot beside "secure"
  const pulse = 90 + sin(frameCount * 0.07) * 70;
  noStroke();
  fill(230, 194, 0, pulse);
  ellipse(lx + 124, y + h - 27, 5, 5);

  textAlign(RIGHT, BOTTOM);
  fill(38, 34, 28);
  textSize(9);
  text("v 0.9.3", rr, y + h - 20);
}

function drawSlot(x, y, w, h, label, focused) {
  noStroke();

  // Shadow
  fill(0, 75);
  rect(x + 3, y + 4, w, h, 10);

  // Body
  fill(9, 7, 5);
  rect(x, y, w, h, 10);

  // Left accent stripe
  fill(focused ? ACCENT : BORDER);
  rect(x, y, 4, h, 10, 0, 0, 10);

  // Inner top shimmer
  fill(255, focused ? 12 : 5);
  rect(x + 4, y + 1, w - 4, h * 0.36, 10, 10, 0, 0);

  // Label text (top of slot)
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(9);
  fill(focused ? ACCENT : TEXT_DIM);
  text(label, x + 18, y + 10);

  // Focus highlight ring
  if (focused) {
    noFill();
    stroke(230, 194, 0, 55);
    strokeWeight(1);
    rect(x - 1, y - 1, w + 2, h + 2, 11);
    noStroke();
  }
}

function drawBtn(x, y, w, h, label, disabled) {
  const hover =
    !disabled && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

  noStroke();

  // Shadow
  fill(0, 90);
  rect(x + 5, y + 7, w, h, 10);

  // Body
  fill(disabled ? "#352a06" : hover ? "#f5e68a" : ACCENT);
  rect(x, y, w, h, 10);

  // Top shimmer
  fill(255, hover ? 46 : 22);
  rect(x + 1, y + 1, w - 2, h * 0.4, 10, 10, 0, 0);

  // Bottom shadow strip
  fill(0, 55);
  rect(x + 2, y + h - 3, w - 4, 2, 0, 0, 6, 6);

  // Label
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(12);
  fill(disabled ? "#555" : "#0f0d0a");
  text(label, x + w / 2, y + h / 2);
  textStyle(NORMAL);

  cursor(hover ? HAND : ARROW);
}

// ── Input DOM placement ───────────────────────────────────────────────────────
function placeInputs(px, py) {
  const lx = px + 48;
  const iw = PANEL_W - 96;

  // Each sits in the lower 2/3 of its slot (label occupies top)
  usernameInput.position(lx + 4, py + 194 + 29);
  usernameInput.size(iw - 8, 30);

  passwordInput.position(lx + 4, py + 272 + 29);
  passwordInput.size(iw - 8, 30);
}

// ── State overlay ─────────────────────────────────────────────────────────────
function drawOverlay(x, y, w, h) {
  if (loginState === "loading") {
    noStroke();
    fill(0, 136);
    rect(x, y, w, h, 16);

    // Spinner
    noFill();
    stroke(ACCENT);
    strokeWeight(2.5);
    const ang = (frameCount * 0.1) % TWO_PI;
    arc(x + w / 2, y + h / 2 - 20, 36, 36, ang, ang + HALF_PI * 2.7);
    noStroke();

    // Text
    fill(ACCENT);
    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    text(
      "AUTHENTICATING" + ".".repeat(floor(frameCount / 14) % 4),
      x + w / 2,
      y + h / 2 + 30,
    );
    textStyle(NORMAL);
  } else if (loginState === "error") {
    const elapsed = millis() - loginTimer;
    if (elapsed > 2800) {
      loginState = "idle";
      return;
    }

    const fi = constrain(map(elapsed, 0, 200, 0, 1), 0, 1);
    const fo = constrain(map(elapsed, 2100, 2800, 1, 0), 0, 1);
    const a = min(fi, fo);

    noStroke();
    fill(140, 30, 20, a * 120);
    rect(x + 48, y + 342, w - 96, 12, 4);

    fill(210, 75, 55, a * 255);
    textAlign(CENTER, CENTER);
    textSize(9);
    text(errorMsg, x + w / 2, y + 348);
  } else if (loginState === "success") {
    const elapsed = millis() - loginTimer;
    const a = constrain(map(elapsed, 0, 420, 0, 225), 0, 225);

    noStroke();
    fill(8, 6, 2, a);
    rect(x, y, w, h, 16);

    const ta = constrain(map(elapsed, 80, 420, 0, 255), 0, 255);
    fill(230, 194, 0, ta);
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text("ACCESS GRANTED", x + w / 2, y + h / 2);
    textStyle(NORMAL);

    if (elapsed > 1100) window.location.href = "index.html";
  }
}

// ── Interactions ──────────────────────────────────────────────────────────────
function mouseClicked() {
  const lx = MARGIN + 48;
  const btnX = lx;
  const btnY = MARGIN + 358;
  const btnW = PANEL_W - 96;
  const btnH = 58;

  if (
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH
  ) {
    tryLogin();
    return;
  }

  // Register link
  const linkY = MARGIN + 444;
  const panCX = MARGIN + PANEL_W / 2;
  if (abs(mouseY - linkY) < 14 && abs(mouseX - panCX) < PANEL_W / 2) {
    errorMsg = "REGISTRATION NOT YET AVAILABLE";
    loginState = "error";
    loginTimer = millis();
  }
}

function tryLogin() {
  if (loginState === "loading" || loginState === "success") return;

  const user = usernameInput.value().trim();
  const pass = passwordInput.value().trim();

  if (!user) {
    errorMsg = "USERNAME REQUIRED";
    loginState = "error";
    loginTimer = millis();
    usernameInput.elt.focus();
    return;
  }
  if (!pass) {
    errorMsg = "PASSWORD REQUIRED";
    loginState = "error";
    loginTimer = millis();
    passwordInput.elt.focus();
    return;
  }

  loginState = "loading";
  setTimeout(() => {
    loginState = "success";
    loginTimer = millis();
  }, 1100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// generated using claude code
