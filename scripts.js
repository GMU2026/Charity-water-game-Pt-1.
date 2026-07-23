// Game settings and state
const TARGET_SCORE = 20;
let currentCans = 0;
let timeLeft = 30;
let gameActive = false;
let spawnInterval;
let timerInterval;


const winMessages = [
 "Amazing! You're helping water projects thrive.",
 "You crushed it! That water will change lives.",
 "Winning! Your clicks brought clean water closer.",
];


const loseMessages = [
 "Nice try — keep practicing and try again!",
 "Almost there. Can you reach 20 next time?",
 "So close! Give it another shot to win.",
];


const grid = document.querySelector('.game-grid');
const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const statusMessage = document.getElementById('status-message');
const startButton = document.getElementById('start-game');


function createGrid() {
 grid.innerHTML = '';
 for (let i = 0; i < 9; i += 1) {
   const cell = document.createElement('div');
   cell.className = 'grid-cell';
   grid.appendChild(cell);
 }
}


function updateScore() {
 scoreDisplay.textContent = currentCans;
}


function updateTimer() {
 timerDisplay.textContent = timeLeft;
}


function randomMessage(messages) {
 return messages[Math.floor(Math.random() * messages.length)];
}


function spawnWaterCan() {
 if (!gameActive) return;
 const cells = document.querySelectorAll('.grid-cell');
 cells.forEach((cell) => {
   cell.innerHTML = '';
 });


 const randomCell = cells[Math.floor(Math.random() * cells.length)];
 randomCell.innerHTML = `
   <div class="water-can-wrapper">
     <div class="water-can" aria-label="jerry can"></div>
   </div>
 `;
}


function startGame() {
 if (gameActive) return;


 currentCans = 0;
 timeLeft = 30;
 gameActive = true;
 startButton.textContent = 'Playing...';
 startButton.disabled = true;
 statusMessage.textContent = 'Tap the jerry can as fast as you can!';
 updateScore();
 updateTimer();
 createGrid();
 spawnWaterCan();


 spawnInterval = setInterval(spawnWaterCan, 900);
 timerInterval = setInterval(() => {
   timeLeft -= 1;
   updateTimer();
   if (timeLeft <= 0) {
     endGame();
   }
 }, 1000);
}


function endGame() {
 if (!gameActive) return;


 gameActive = false;
 clearInterval(spawnInterval);
 clearInterval(timerInterval);
 grid.querySelectorAll('.grid-cell').forEach((cell) => {
   cell.innerHTML = '';
 });


 const message = currentCans >= TARGET_SCORE
   ? randomMessage(winMessages)
   : randomMessage(loseMessages);


 statusMessage.textContent = `${message} Final score: ${currentCans}.`;
 startButton.textContent = 'Play Again';
 startButton.disabled = false;
}


grid.addEventListener('click', (event) => {
 if (!gameActive) return;
 const target = event.target;
 if (target.closest('.water-can')) {
   currentCans += 1;
   updateScore();
   target.closest('.grid-cell').innerHTML = '';
   spawnWaterCan();
 }
});


startButton.addEventListener('click', startGame);


createGrid();
updateScore();
updateTimer();
