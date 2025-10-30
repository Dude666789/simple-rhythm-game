// Rhythym Game
// Armin Mihalache
// Date: 28/10/25-
//
// Extra for Experts:
// - A rhythym game


let Music;
let activeNotes = [];
let currentNoteIndex = 0;
let Score = 0;
let HitY = 35;
let NoteSpeed = 5;
let NoteSize = 55;
let Status = "";

// lane setup
let lanes = [
  { key: 'a', x: 433, color: 'rgb(91,206,250)' },
  { key: 's', x: 508, color: 'rgb(245,169,184)' },
  { key: 'd', x: 583, color: 'rgb(255,255,255)' },
  { key: 'f', x: 658, color: 'rgb(245,169,184)' },
  { key: 'g', x: 733, color: 'rgb(91,206,250)' }
];

function preload() {
  Music = loadSound('assets/TheDivineComedy.mp3');
}

function setup() {
  createCanvas(800, 600);
  Music.play();
  textFont('monospace');
}

function draw() {
  background('grey');

  // draw hit circles
  for (let lane of lanes) {
    fill('white');
    ellipse(lane.x, HitY, NoteSize, NoteSize);
  }

  // spawn notes according to chart timing
  let currentTime = Music.currentTime();
  if (currentNoteIndex < Chart.length && currentTime >= Chart[currentNoteIndex].time) {
    spawnNotes(Chart[currentNoteIndex].key);
    currentNoteIndex++;
  }

  // move & draw active notes
  for (let i = activeNotes.length - 1; i >= 0; i--) {
    let note = activeNotes[i];
    note.y -= NoteSpeed;
    fill(note.color);
    ellipse(note.x, note.y, 55, 55);

    // missed note
    if (note.y < -75) {
      activeNotes.splice(i, 1);
      Score = max(0, Score - 1);
      Status = "Miss!";
    }
    if (NoteSize > 65) {
      NoteSize = 55;
    }
  }

  // HUD
  fill('black');
  textSize(25);
  text(`Score: ${Score}`, 20, 30);
  text(`Time: ${currentTime.toFixed(2)}`, 500, 590);
  text("Song: The Divine Comedy - Frums", 10, 590);

  // Game Over
  if (!Music.isPlaying()) {
    noLoop();
    fill('black');
    textSize(50);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2);
    textSize(30);
    text(`Final Score: ${Score}`, width / 2, height / 2 + 50);
    if (Score => 91) {
      text("Perfect Score! Amazing!", width / 2, height / 2 + 90);
    }
    
  }

  textAlign(LEFT);
  text(Status, 20, 60);
}

function keyPressed() {
  let k = key.toLowerCase();
  for (let i = activeNotes.length - 1; i >= 0; i--) {
    let note = activeNotes[i];
    if (note.key === k && abs(note.y - HitY) < 70) {
      Score++;
      activeNotes.splice(i, 1);
      NoteSize += 10;
      Status = "Great!";
      return;
    }
  }
  Score = max(0, Score - 2); // penalty for missing
  Status = "Woops";
}

function spawnNotes(keys) {
  for (let k of keys) {
    let lane = lanes.find(l => l.key === k);
    if (lane) {
      activeNotes.push({
        key: k,
        x: lane.x,
        y: 600,
        color: lane.color
      });
    }
  }
}