//----- Constants -----//
const CORNERRADIUS = 8;
const SURFACE = "#141210";
const PLAYHEAD_COLOR = "#f5d48a";
const ACTIVE_COLOR = "#e8a94a";
const ACTIVE_BRIGHT = "#f5d48a";
const ACTIVE_BORDER = "#7a4e18";
const BG = "#0c0a08";
const PIANO_W = 68;
const HEADER_H = 36;
const PAD = 8;
const OCTAVES = 5;
const COLS = 64;

//----- Notes-----//
let noteNames = [
  "B",
  "Bb",
  "A",
  "Ab",
  "G",
  "Gb",
  "F",
  "E",
  "Eb",
  "D",
  "Db",
  "C",
];
let blackKeys = [1, 3, 5, 8, 10];

//----- Variables -----//
let rows = OCTAVES * 12;
let noteW, noteH;
let notes = [];
let isPlaying = false;
let bpm = 120;
let currentBeat = 0;
let nextBeat = 0;

class Note {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.noteLength;
    this.
  }
}




function loadGrid() {
  let saved = localStorage.getItem("piano_roll");
  if (saved) {
    pianoRollArray = JSON.parse(saved);
  }
}
