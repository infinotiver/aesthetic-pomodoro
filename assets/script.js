let durations = {
    focus: 25 * 60,       // 25 min
    shortBreak: 5 * 60,   // 5 min
    longBreak: 15 * 60    // 15 min
};

let mode = "focus";          // "focus", "shortBreak", "longBreak"
let remainingTime = durations[mode];
let pomodoroCount = 0;
let completedCycles = 0;
let timerInterval = null;
let isRunning = false;

const display = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const standBtn = document.getElementById("stand-btn");
const modeDisplay = document.getElementById("mode");
const pomodoroCountEl = document.getElementById("pomodoro-count");

// Format seconds to MM:SS
function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// Update timer on screen
function updateDisplay() {
    display.textContent = formatTime(remainingTime);
    document.title = `${formatTime(remainingTime)} - ${modeName(mode)}`;
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const fullDuration = durations[mode];
    const percent = (remainingTime / fullDuration) * 100;
    progressBar.style.width = `${percent}%`;
}


// Convert mode id to label
function modeName(m) {
    if (m === "focus") return "Focus";
    if (m === "shortBreak") return "Break";
    if (m === "longBreak") return "Long Break";
    return "";
}

// Show a browser notification
function sendNotification(text) {
    if (Notification.permission === "granted") {
        new Notification(text);
    }
}

// Switch to a new mode and restart timer
function switchMode(newMode) {
    mode = newMode;
    remainingTime = durations[newMode];
    modeDisplay.textContent = modeName(mode);
    updateDisplay();
    sendNotification(`Time for ${modeName(newMode)}!`);
    startTimer(); // auto-start
}

// Start/resume countdown
function startTimer() {
    isRunning = true;
    startBtn.textContent = "Pause";

    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;

            if (mode === "focus") {
                pomodoroCount++;
                pomodoroCountEl.textContent = pomodoroCount;

                if (pomodoroCount % 4 === 0) {
                    completedCycles++;
                    switchMode("longBreak");
                } else {
                    switchMode("shortBreak");
                }

            } else {
                switchMode("focus");
            }
        }
    }, 1000);
}

// Pause
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "Start";
}

// Toggle start/pause
function toggleStartPause() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

// Reset everything
function resetTimer() {
    pauseTimer();
    mode = "focus";
    remainingTime = durations[mode];
    modeDisplay.textContent = "Focus";
    startBtn.textContent = "Start";
    updateDisplay();
}

// Manual "Stand" break
function standBreak() {
    pauseTimer();
    mode = "stand";
    remainingTime = 5 * 60;
    modeDisplay.textContent = "Stand Break";
    updateDisplay();
    sendNotification("Time to stand up!");
}

// Ask for notification permission
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// Events
startBtn.addEventListener("click", toggleStartPause);
resetBtn.addEventListener("click", resetTimer);
standBtn.addEventListener("click", standBreak);

// Init
requestNotificationPermission();
updateDisplay();


pomodoroCountEl.textContent = pomodoroCount;


function goFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}
