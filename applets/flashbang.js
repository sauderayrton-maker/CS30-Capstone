let brightness = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(brightness);
  words();
  changeColor();
}

function changeColor() {
  if (brightness > 0) {
    brightness -= 0.5;
    console.log(brightness);
  }
}

function words() {
  fill(255);
  textSize(50);
  noStroke();
  textAlign(CENTER, CENTER);
  text(
    "Who has ever wanted light mode. Go back to the last tab. Ew.",
    width / 2,
    height / 2,
  );
}
