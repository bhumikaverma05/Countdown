let totalSeconds = 0;
let interval = null;
let paused = false;

const hoursBox = document.getElementById("hours");
const minutesBox = document.getElementById("minutes");
const secondsBox = document.getElementById("seconds");
const secondsCard = document.getElementById("seconds-card");

const tickSound = document.getElementById("tick");
const finalSound = document.getElementById("final");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const indicator = document.querySelector(".pill-indicator");

const inputHours = document.getElementById("setHours");
const inputMinutes = document.getElementById("setMinutes");
const inputSeconds = document.getElementById("setSeconds");

const endMessages = [
  "Time’s up. Take a quick break.",
  "Countdown finished. Ready for the next one?",
  "No seconds left. Try again.",
  "That went fast. Reset and go again.",
  "Timer ended. Good effort.",
  "The clock reached zero. Start a new round.",
  "Done. Your countdown is complete.",
  "Out of time. Want another try?"
];

function moveIndicatorTo(index) {
  const segmentWidth = indicator.offsetWidth;
  const leftOffset = 8 + index * (segmentWidth + 10);
  indicator.style.left = leftOffset + "px";
}

function lockInputs(lock) {
  inputHours.disabled = lock;
  inputMinutes.disabled = lock;
  inputSeconds.disabled = lock;
}

function updateUI() {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  hoursBox.textContent = String(hrs).padStart(2, "0");
  minutesBox.textContent = String(mins).padStart(2, "0");
  secondsBox.textContent = String(secs).padStart(2, "0");
}

function startTimer() {
  if (interval) return;

  const hrs = Number(inputHours.value) || 0;
  const mins = Number(inputMinutes.value) || 0;
  const secs = Number(inputSeconds.value) || 0;

  totalSeconds = hrs * 3600 + mins * 60 + secs;
  if (totalSeconds === 0) return;

  paused = false;
  pauseBtn.textContent = "Pause";

  startBtn.disabled = true;
  lockInputs(true);

  startBtn.classList.add("active");
  pauseBtn.classList.remove("active");
  resetBtn.classList.remove("active");

  moveIndicatorTo(0);

  updateUI();
  interval = setInterval(runTimer, 1000);
}

function runTimer() {
  if (paused) return;

  if (totalSeconds <= 0) {
    clearInterval(interval);
    interval = null;
    showPopup();
    return;
  }

  totalSeconds--;

  tickSound.currentTime = 0;
  tickSound.play();

  if (totalSeconds <= 10) {
    secondsCard.classList.add("urgent");

    secondsCard.classList.remove("flip");
    void secondsCard.offsetWidth;
    secondsCard.classList.add("flip");

    finalSound.play();
  }

  updateUI();
}

function pauseTimer() {
  if (!interval) return;

  paused = !paused;

  if (paused) {
    pauseBtn.textContent = "Resume";

    pauseBtn.classList.add("active");
    startBtn.classList.remove("active");
    resetBtn.classList.remove("active");

    moveIndicatorTo(1);
  } else {
    pauseBtn.textContent = "Pause";

    startBtn.classList.add("active");
    pauseBtn.classList.remove("active");

    moveIndicatorTo(0);
  }
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  paused = false;
  totalSeconds = 0;

  secondsCard.classList.remove("urgent");

  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";

  lockInputs(false);

  startBtn.classList.remove("active");
  pauseBtn.classList.remove("active");
  resetBtn.classList.add("active");

  moveIndicatorTo(2);

  setTimeout(() => {
    resetBtn.classList.remove("active");
    moveIndicatorTo(0);
  }, 600);

  updateUI();
}

function showPopup() {
  const msg = document.getElementById("popup-message");
  msg.textContent = endMessages[Math.floor(Math.random() * endMessages.length)];
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  resetTimer();
}

/* Particle Background */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,234,255,0.6)";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
