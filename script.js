let totalSeconds = 0;
let interval = null;
let paused = false;

const h = document.getElementById("hours");
const m = document.getElementById("minutes");
const s = document.getElementById("seconds");
const secondsCard = document.getElementById("seconds-card");

const tickSound = document.getElementById("tick");
const finalSound = document.getElementById("final");

/* START TIMER IMMEDIATELY */
function startTimer() {
  if (interval) return;

  if (totalSeconds === 0) {
    const hrs = +setHours.value || 0;
    const mins = +setMinutes.value || 0;
    const secs = +setSeconds.value || 0;

    totalSeconds = hrs * 3600 + mins * 60 + secs;
  }

  if (totalSeconds === 0) return;

  updateUI(); // show instantly

  interval = setInterval(runTimer, 1000);
}

/* COUNTDOWN */
function runTimer() {
  if (paused) return;

  if (totalSeconds <= 0) {
    clearInterval(interval);
    interval = null;
    endPopup();
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

/* UPDATE UI */
function updateUI() {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  h.textContent = String(hrs).padStart(2, "0");
  m.textContent = String(mins).padStart(2, "0");
  s.textContent = String(secs).padStart(2, "0");
}

/* PAUSE */
function pauseTimer() {
  paused = !paused;
}

/* RESET */
function resetTimer() {
  clearInterval(interval);
  interval = null;
  paused = false;
  totalSeconds = 0;

  secondsCard.classList.remove("urgent");

  h.textContent = "00";
  m.textContent = "00";
  s.textContent = "00";
}

/* POPUP */
function endPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  resetTimer();
}

/* PARTICLES BACKGROUND */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = Array.from({ length: 60 }, () => ({
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
