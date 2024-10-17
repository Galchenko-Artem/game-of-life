let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let sizeInput = document.getElementById('size');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let randomButton = document.getElementById('random');
let timeDisplay = document.getElementById('time');

let gridSize = parseInt(sizeInput.value);
let cellSize = 10;
let grid;
let animationId;
let isRunning = false;

function initializeGrid() {
  grid = new Array(gridSize);
  for (let x = 0; x < gridSize; x++) {
    grid[x] = new Array(gridSize).fill(0);
  }
}

function resizeCanvas() {
  cellSize = 10;
  canvas.width = cellSize * gridSize;
  canvas.height = cellSize * gridSize;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid[x][y]) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function getNeighbors(x, y) {
  let neighbors = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        let nx = (x + dx + gridSize) % gridSize;
        let ny = (y + dy + gridSize) % gridSize;
        neighbors += grid[nx][ny];
      }
    }
  }
  return neighbors;
}

function updateGrid() {
  let newGrid = new Array(gridSize);
  for (let x = 0; x < gridSize; x++) {
    newGrid[x] = new Array(gridSize).fill(0);
  }
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let neighbors = getNeighbors(x, y);
      if (grid[x][y]) {
        if (neighbors === 2 || neighbors === 3) {
          newGrid[x][y] = 1;
        } else {
          newGrid[x][y] = 0;
        }
      } else {
        if (neighbors === 3) {
          newGrid[x][y] = 1;
        } else {
          newGrid[x][y] = 0;
        }
      }
    }
  }
  grid = newGrid;
}

function gameLoop() {
  let startTime = performance.now();
  updateGrid();
  drawGrid();
  let endTime = performance.now();
  let generationTime = (endTime - startTime).toFixed(2);
  timeDisplay.textContent = `${generationTime} мс`;
  if (isRunning) {
    setTimeout(gameLoop, 100);
  }
}


function startGame() {
  if (!isRunning) {
    isRunning = true;
    animationId = requestAnimationFrame(gameLoop);
  }
}

function stopGame() {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(animationId);
  }
}

function randomizeGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = Math.random() > 0.5 ? 1 : 0;
    }
  }
  drawGrid();
}

canvas.addEventListener('click', function (event) {
  let rect = canvas.getBoundingClientRect();
  let x = Math.floor((event.clientX - rect.left) / cellSize);
  let y = Math.floor((event.clientY - rect.top) / cellSize);
  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    grid[x][y] = grid[x][y] ? 0 : 1;
    drawGrid();
  }
});

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
randomButton.addEventListener('click', randomizeGrid);

sizeInput.addEventListener('change', function () {
  gridSize = parseInt(sizeInput.value);
  stopGame();
  initializeGrid();
  resizeCanvas();
  drawGrid();
});

initializeGrid();
resizeCanvas();
drawGrid();
