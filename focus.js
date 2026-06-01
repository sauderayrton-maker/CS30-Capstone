let pianoWin, drumWin, pianoFrame, drumFrame;
let focused = null;

function setup() {
  noCanvas();

  pianoWin = select(".piano-space");
  drumWin = select(".drum-space");
  pianoFrame = pianoWin.elt.querySelector("iframe");
  drumFrame = drumWin.elt.querySelector("iframe");

  pianoWin.mouseClicked(() => setFocus("piano"));
  drumWin.mouseClicked(() => setFocus("drum"));

  document.addEventListener("keydown", (e) => {
    const frame =
      focused === "piano" ? pianoFrame : focused === "drum" ? drumFrame : null;
    if (!frame) return;

    frame.contentWindow.postMessage(
      {
        type: "keydown",
        key: e.key,
        keyCode: e.keyCode,
        code: e.code,
      },
      "*",
    );
  });
}

function setFocus(target) {
  focused = target;
  pianoWin.toggleClass("highlighted", target === "piano");
  drumWin.toggleClass("highlighted", target === "drum");
}

function draw() {
  // nothing to draw in the parent — iframes handle their own canvases
}
