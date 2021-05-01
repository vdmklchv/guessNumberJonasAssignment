'use strict';


// state vars
let secretNumber;
let score;
let hiScore = 0;



// DOM elements
const body = document.querySelector('body');
const guessInput = document.querySelector('.guess');
const checkButton = document.querySelector('.check');
const message = document.querySelector('.message');
const numberBox = document.querySelector('.number');
const scoreDisplay = document.querySelector('.score');
const againButton = document.querySelector('.again');
const highScoreDisplay = document.querySelector('.highscore');

// Factory UI function
function UI() {};
UI.prototype.setMessage = function (text) {
  message.textContent = text;
}
UI.prototype.setBgColor = function (color) {
  body.style.backgroundColor = color;
}
UI.prototype.setNumberBoxWidth = function (width) {
  numberBox.style.width = width;
}
UI.prototype.setInputsButtons = function (isGameOver) {
  if (isGameOver) {
    checkButton.disabled = true;
    guessInput.disabled = true;
    againButton.disabled = false;
  } else {
    checkButton.disabled = false;
    guessInput.disabled = false;
    againButton.disabled = true;
  }
}
UI.prototype.setScoreDisplay = function (score) {
  scoreDisplay.textContent = score;
}
UI.prototype.setHighScore = function (hiscore) {
  highScoreDisplay.textContent = hiscore;
}
UI.prototype.clearInput = function () {
  guessInput.value = '';
}
UI.prototype.showSecretNumber = function (number) {
  numberBox.textContent = number;
}

// Factory score function
const Score = function () {
  this.score = 0;
  this.highScore = 0;
}

Score.prototype.setScore = function (score) {
  this.score = score;
}

Score.prototype.setHighScore = function (score) {
  this.highScore = score;
}

Score.prototype.getScore = function () {
  return this.score;
}

Score.prototype.getHighScore = function () {
  return this.highScore;
}

Score.prototype.decreaseScore = function () {
  this.score--;
}

const scoreManager = new Score();


// Functions
const gameOver = function (isWon) {
  const ui = new UI();
  if (isWon) {
    ui.setBgColor("#60b347");
    ui.setMessage("Correct number!");
    ui.setNumberBoxWidth("30rem");
  } else {
    ui.setBgColor("#ff1111");
    ui.setMessage("You have lost the game!");
  }
  ui.setInputsButtons(true);
}

const gameStart = function () {
  const ui = new UI();
  // logic
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  scoreManager.setScore(20);
  // ui
  ui.setNumberBoxWidth("15rem");
  ui.setScoreDisplay("20");
  ui.setMessage("Start guessing...");
  ui.setBgColor("#222");
  ui.setInputsButtons(false);
  ui.clearInput();
  ui.showSecretNumber("?");
  guessInput.focus();
}

const game = function () {
  const ui = new UI();
  const guess = Number(guessInput.value);

  // When there is no input
  if (!guess) {
    ui.setMessage("No number (;");

    // Guess is correct
  } else if (guess === secretNumber) {
    if (scoreManager.getHighScore() < scoreManager.getScore()) {
      scoreManager.setHighScore(scoreManager.getScore());
    }
    ui.showSecretNumber(secretNumber);
    ui.setHighScore(scoreManager.getHighScore());
    gameOver(true);
    // Guess is too high
  } else if (guess > secretNumber) {
    if (scoreManager.getScore() > 1) {
      ui.setMessage("Too high!");
      scoreManager.decreaseScore();
      ui.setScoreDisplay(scoreManager.getScore());
      ui.clearInput();
    } else {
      gameOver(false);
      ui.setScoreDisplay(0);
    }

    // Guess is too low
  } else if (guess < secretNumber) {
    if (scoreManager.getScore() > 1) {
      ui.setMessage("Too low!");
      scoreManager.decreaseScore();
      ui.setScoreDisplay(scoreManager.getScore());
      ui.clearInput();
    } else {
      gameOver(false);
      ui.setScoreDisplay(0);
    }
  }
}

// Start game
gameStart();

// EventListeners
checkButton.addEventListener('click', game);

guessInput.addEventListener('keypress', function (e) {
  if (e.key === "Enter" && guessInput.disabled === false) {
    game();
  }
})

againButton.addEventListener('click', gameStart);

document.addEventListener('keypress', function (e) {
  if (guessInput.disabled === true && e.key === " ") {
    gameStart();
  }
})