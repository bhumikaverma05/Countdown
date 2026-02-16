let totalSeconds = 0;
let maxSeconds = 1;
let interval = null;
let paused = false;

const timeText = document.getElementById("timeText");
const progressBar = document.getElementById("progressBar");

const inputHours = document.getElementById("setHours");
const inputMinutes = document.getElementById("setMinutes");
const inputSeconds = document.getElementById("setSeconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

/* Presets */
function setPreset(mins) {
  if (interval) return;

  inputHours.value = 0;
  inputMinutes.value = mins;
  inputSeconds.value = 0;

  updatePreview();
}

/* Lock Inputs */
function lockInputs(lock) {
  inputHours.disabled = lock;
  inputMinutes.disabled = lock;
  inputSeconds.disabled = lock;
}

/* Update Display */
function updateUI() {
  let hrs = Math.floor(totalSeconds / 3600);
  let mins = Math.floor((totalSeconds % 3600) / 60);
  let secs = totalSeconds % 60;

  timeText.textContent =
    String(hrs).padStart(2, "0") + ":" +
    String(mins).padStart(2, "0") + ":" +
    String(secs).padStart(2, "0");

  let progress = totalSeconds / maxSeconds;
  progressBar.style.width = progress * 100 + "%";
}

/* Preview */
function updatePreview() {
  let hrs = Number(inputHours.value) || 0;
  let mins = Number(inputMinutes.value) || 0;
  let secs = Number(inputSeconds.value) || 0;

  let preview = hrs * 3600 + mins * 60 + secs;
  if (preview === 0) return;

  totalSeconds = preview;
  maxSeconds = preview;
  updateUI();
}

/* Start */
function startTimer() {
  if (interval) return;

  let hrs = Number(inputHours.value) || 0;
  let mins = Number(inputMinutes.value) || 0;
  let secs = Number(inputSeconds.value) || 0;

  totalSeconds = hrs * 3600 + mins * 60 + secs;
  if (totalSeconds === 0) return;

  maxSeconds = totalSeconds;
  paused = false;

  startBtn.disabled = true;
  pauseBtn.textContent = "Pause";
  lockInputs(true);

  interval = setInterval(runTimer, 1000);
}

/* Run */
function runTimer() {
  if (paused) return;

  if (totalSeconds <= 0) {
    clearInterval(interval);
    interval = null;
    finishSequence();
    return;
  }

  totalSeconds--;

  if (totalSeconds <= 10) {
    timeText.classList.add("danger");
    progressBar.classList.add("danger-bar");
  }

  updateUI();
}

/* Pause */
function pauseTimer() {
  if (!interval) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
}

/* Reset */
function resetTimer() {
  clearInterval(interval);
  interval = null;
  paused = false;

  totalSeconds = 0;
  maxSeconds = 1;

  inputHours.value = "";
  inputMinutes.value = "";
  inputSeconds.value = "";

  lockInputs(false);

  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";

  timeText.classList.remove("danger");
  progressBar.classList.remove("danger-bar");

  progressBar.style.width = "100%";
  timeText.textContent = "00:00:00";
}

/* Finish Popup */
function finishSequence() {
  popupMessage.textContent = "Timer Finished Successfully.";
  popup.style.display = "flex";
}

/* Close Popup */
function closePopup() {
  popup.style.display = "none";
  resetTimer();
}

updateUI();
