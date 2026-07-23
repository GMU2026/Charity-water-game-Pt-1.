// ------------------------------
// Game settings
// ------------------------------

const TARGET_SCORE = 20;
const STARTING_TIME = 30;
const NUMBER_OF_SPACES = 16;
const SPAWN_SPEED = 850;
const CAN_LIFETIME = 750;

// ------------------------------
// Game state
// ------------------------------

let currentCans = 0;
let timeLeft = STARTING_TIME;
let gameActive = false;

let spawnInterval = null;
let timerInterval = null;
let removeCanTimeout = null;

// ------------------------------
// Messages
// ------------------------------

const winMessages = [
  "Amazing! You completed the clean-water challenge.",
  "You did it! Clean water is one step closer.",
  "Great work! Every action can make a difference."
];

const loseMessages = [
  "Nice try! Keep practicing and try again.",
  "Almost there! Can you reach 20 next time?",
  "Good effort! Give the challenge another shot."
];

// ------------------------------
// Select HTML elements
// ------------------------------

const grid = document.getElementById("game-grid");
const scoreDisplay = document.getElementById("current-cans");
const targetDisplay = document.getElementById("target-cans");
const timerDisplay = document.getElementById("timer");
const statusMessage = document.getElementById("status-message");
const startButton = document.getElementById("start-button");

const progressBar = document.getElementById("progress-bar");
const progressPercent = document.getElementById("progress-percent");
const progressTrack = document.getElementById("progress-track");

// ------------------------------
// Create the game board
// ------------------------------

function createGameGrid() {
  grid.innerHTML = "";

  for (let i = 0; i < NUMBER_OF_SPACES; i++) {
    const gridSpace = document.createElement("div");

    gridSpace.classList.add("grid-space");
    gridSpace.dataset.index = i;

    grid.appendChild(gridSpace);
  }
}

// ------------------------------
// Start or restart the game
// ------------------------------

function startGame() {
  // Stop any older timers before starting a new game.
  clearGameTimers();

  // Reset the game values.
  currentCans = 0;
  timeLeft = STARTING_TIME;
  gameActive = true;

  // Reset the page.
  scoreDisplay.textContent = currentCans;
  timerDisplay.textContent = timeLeft;

  statusMessage.textContent = "Go! Click the water cans!";
  statusMessage.classList.remove("win", "lose");

  startButton.disabled = true;
  startButton.textContent = "Game in Progress";

  removeWaterCan();
  updateProgress();

  // Show the first water can immediately.
  spawnWaterCan();

  // Create another water can on a repeating schedule.
  spawnInterval = setInterval(spawnWaterCan, SPAWN_SPEED);

  // Start the countdown timer.
  timerInterval = setInterval(updateTimer, 1000);
}

// ------------------------------
// Create a water can
// ------------------------------

function spawnWaterCan() {
  if (!gameActive) {
    return;
  }

  // Remove the previous can so only one is active.
  removeWaterCan();

  const gridSpaces = document.querySelectorAll(".grid-space");

  const randomIndex = Math.floor(
    Math.random() * gridSpaces.length
  );

  const selectedSpace = gridSpaces[randomIndex];

  const waterCan = document.createElement("button");

  waterCan.type = "button";
  waterCan.classList.add("water-can");
  waterCan.textContent = "💧";
  waterCan.setAttribute("aria-label", "Collect this water can");

  waterCan.addEventListener("click", collectWaterCan);

  selectedSpace.appendChild(waterCan);

  // Remove the can if it is not clicked quickly enough.
  removeCanTimeout = setTimeout(() => {
    if (waterCan.isConnected) {
      waterCan.remove();
    }
  }, CAN_LIFETIME);
}

// ------------------------------
// Collect a water can
// ------------------------------

function collectWaterCan(event) {
  if (!gameActive) {
    return;
  }

  const clickedCan = event.currentTarget;

  // Disable the button immediately to prevent double-click points.
  clickedCan.disabled = true;
  clickedCan.remove();

  clearTimeout(removeCanTimeout);

  currentCans++;
  scoreDisplay.textContent = currentCans;

  updateProgress();

  if (currentCans >= TARGET_SCORE) {
    endGame(true);
    return;
  }

  statusMessage.textContent =
    `${TARGET_SCORE - currentCans} more water cans to go!`;
}

// ------------------------------
// Update the countdown
// ------------------------------

function updateTimer() {
  if (!gameActive) {
    return;
  }

  timeLeft--;
  timerDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    timeLeft = 0;
    timerDisplay.textContent = timeLeft;

    endGame(false);
  }
}

// ------------------------------
// Update progress bar
// ------------------------------

function updateProgress() {
  const percentage = Math.min(
    (currentCans / TARGET_SCORE) * 100,
    100
  );

  progressBar.style.width = `${percentage}%`;
  progressPercent.textContent = `${Math.round(percentage)}%`;

  progressTrack.setAttribute(
    "aria-valuenow",
    currentCans
  );
}

// ------------------------------
// End the game
// ------------------------------

function endGame(playerWon) {
  gameActive = false;

  clearGameTimers();
  removeWaterCan();

  startButton.disabled = false;
  startButton.textContent = "Play Again";

  if (playerWon) {
    const message = getRandomMessage(winMessages);

    statusMessage.textContent =
      `${message} You collected ${currentCans} water cans!`;

    statusMessage.classList.add("win");
    statusMessage.classList.remove("lose");
  } else {
    const message = getRandomMessage(loseMessages);

    statusMessage.textContent =
      `${message} You collected ${currentCans} out of ${TARGET_SCORE}.`;

    statusMessage.classList.add("lose");
    statusMessage.classList.remove("win");
  }
}

// ------------------------------
// Remove active water can
// ------------------------------

function removeWaterCan() {
  const activeCan = document.querySelector(".water-can");

  if (activeCan) {
    activeCan.remove();
  }

  clearTimeout(removeCanTimeout);
  removeCanTimeout = null;
}

// ------------------------------
// Stop all timers
// ------------------------------

function clearGameTimers() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  clearTimeout(removeCanTimeout);

  spawnInterval = null;
  timerInterval = null;
  removeCanTimeout = null;
}

// ------------------------------
// Choose a random message
// ------------------------------

function getRandomMessage(messages) {
  const randomIndex = Math.floor(
    Math.random() * messages.length
  );

  return messages[randomIndex];
}

// ------------------------------
// Start-button event
// ------------------------------

startButton.addEventListener("click", startGame);

// ------------------------------
// Initial page setup
// ------------------------------

targetDisplay.textContent = TARGET_SCORE;
timerDisplay.textContent = STARTING_TIME;

createGameGrid();
updateProgress();
