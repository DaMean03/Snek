const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const startBtn = document.querySelector("#startBtn");
const mobileControls = document.querySelector("#controls");
const mobileButtons = document.querySelectorAll(".btn");

function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";

let unitSize;
let gameSpeed;
let snake;
if (isMobile()) {
  gameSpeed = 150;
  unitSize = 20;
  snake = [
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  mobileControls.style.display = "block";
  const deviceWidth = window.innerWidth;
  gameBoard.width = Math.floor((deviceWidth - 6) / unitSize) * unitSize;
  gameBoard.height = Math.floor((deviceWidth - 6) / unitSize) * unitSize;
} else {
  gameSpeed = 100;
  unitSize = 25;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
}
const gameWidth = gameBoard.width;
const gameHeigth = gameBoard.height;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", gameStart);
mobileButtons.forEach((button) =>
  button.addEventListener("click", changeDirection)
);

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
  startBtn.disabled = true;
}
function nextTick() {
  if (running) {
    setTimeout(() => {
      resetBtn.disabled = true;
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, gameSpeed);
  } else {
    displayGameOver();
    resetBtn.disabled = false;
  }
}
function clearBoard() {
  context.fillStyle = boardBackground;
  context.fillRect(0, 0, gameWidth, gameHeigth);
}
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
}
function drawFood() {
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    if (isMobile()) {
      if (gameSpeed > 80) {
        gameSpeed -= 5;
      }
    } else {
      if (gameSpeed > 60) {
        gameSpeed -= 2;
      }
    }
    console.log(gameSpeed);
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}
function drawSnake() {
  context.fillStyle = snakeColor;
  context.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function changeDirection(event) {
  const keyPressed = event.keyCode;
  const buttonClicked = event.target;
  const LEFT = [37, document.querySelector(".left")];
  const UP = [38, document.querySelector(".top")];
  const RIGHT = [39, document.querySelector(".right")];
  const DOWN = [40, document.querySelector(".bottom")];

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case (keyPressed == LEFT[0] && !goingRight) ||
      (buttonClicked == LEFT[1] && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case (keyPressed == UP[0] && !goingDown) ||
      (buttonClicked == UP[1] && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case (keyPressed == RIGHT[0] && !goingLeft) ||
      (buttonClicked == RIGHT[1] && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case (keyPressed == DOWN[0] && !goingUp) ||
      (buttonClicked == DOWN[1] && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
    case snake[0].x >= gameWidth:
    case snake[0].y < 0:
    case snake[0].y >= gameHeigth:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}
function displayGameOver() {
  context.font = "50px MV Boli";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText("GAME OVER!", gameWidth / 2, gameHeigth / 2);
  running = false;
}
function resetGame() {
  if (isMobile()) {
    gameSpeed = 150;
    snake = [
      { x: unitSize * 2, y: 0 },
      { x: unitSize, y: 0 },
      { x: 0, y: 0 },
    ];
  } else {
    gameSpeed = 100;
    snake = [
      { x: unitSize * 4, y: 0 },
      { x: unitSize * 3, y: 0 },
      { x: unitSize * 2, y: 0 },
      { x: unitSize, y: 0 },
      { x: 0, y: 0 },
    ];
  }
  score = 0;
  scoreText.textContent = score;
  xVelocity = unitSize;
  yVelocity = 0;
  clearBoard();
  startBtn.disabled = false;
}
