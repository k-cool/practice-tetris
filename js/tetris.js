import BLOCKS from "./blocks.js";
import BGM from "./bgm.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameOver = document.querySelector(".gameOver");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".gameOver > button");
const volumeOnIcon = document.querySelector(".on");
const volumeOffIcon = document.querySelector(".off");

// Setting
const blockArray = Object.entries(BLOCKS);
const GAME_ROWS = 20;
const GAME_COLS = 10;
const DIFICAULTY = {
  easy: {
    duration: 1000,
  },
  nomal: {
    duration: 500,
  },
  hard: {
    duration: 200,
  },
  hell: {
    duration: 100,
  },
};
const NOMAL_SCORE = 20;
const HARD_SCORE = 30;
const HELL_SCORE = 40;

// BGM
const bgmSourceUrl = "asset/bgm/dreams.mp3";
const bgm = new BGM("bgm", bgmSourceUrl, 0.5, true);
volumeOnIcon.addEventListener("click", () => {
  bgm.pauseMusic();
  volumeOnIcon.classList.add("hidden");
  volumeOffIcon.classList.remove("hidden");
});
volumeOffIcon.addEventListener("click", () => {
  bgm.startMusic();
  volumeOffIcon.classList.add("hidden");
  volumeOnIcon.classList.remove("hidden");
});

bgm.init();

// Variables
let currentDificalty = "easy";
let score = 0;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "zee",
  direction: 0,
  top: 0,
  left: 3,
};

init();

// Functions
function init() {
  tempMovingItem = { ...movingItem };

  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }

  generateNewBlock();
}

function reset() {
  playground.innerHTML = "";
  gameOver.style.display = "none";
  init();
}

function prependNewLine() {
  const row = document.createElement("li");
  const matrixWrapper = document.createElement("ul");

  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    matrixWrapper.prepend(matrix);
  }

  row.prepend(matrixWrapper);
  playground.prepend(row);
}

function renderBlocks(moveType = "") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((blocks) => {
    blocks.classList.remove(type, "moving");
  });

  BLOCKS[type][direction].some((block) => {
    const x = block[0] + left;
    const y = block[1] + top;

    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;

    const isAvailable = checkEmpty(target);

    if (isAvailable) target.classList.add(type, "moving");
    else {
      tempMovingItem = { ...movingItem };

      if (moveType === "retry") {
        clearInterval(downInterval);
        showGameOverText();
      }

      setTimeout(() => {
        renderBlocks("retry");
        if (moveType === "top") seizeBlock();
      }, 0);

      return true;
    }
  });

  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });

  checkMatch();
}

function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, DIFICAULTY[currentDificalty].duration);

  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function showGameOverText() {
  gameOver.style.display = "flex";

  const handleKeydownEnter = (e) => {
    if (e.code === "Enter") {
      reset();
      window.removeEventListener("keydown", handleKeydownEnter);
    }
  };

  window.addEventListener("keydown", handleKeydownEnter);
}

function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) return false;
  return true;
}

function checkMatch() {
  const childNodes = playground.childNodes;

  let matchLineCount = 0;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) matched = false;
    });

    if (matched) {
      child.remove();
      prependNewLine();
      matchLineCount++;
    }
  });

  for (let i = 0; i < matchLineCount; i++) {}

  if (matchLineCount) {
    const addingScore = getAddingScore(matchLineCount);
    console.log(matchLineCount, addingScore);
    score += addingScore;
    scoreDisplay.innerText = score;

    scoreDisplay.classList.add("zoomin");
    setTimeout(() => {
      scoreDisplay.classList.remove("zoomin");
    }, 300);
  }

  currentDificalty = getDificalty(score);
  generateNewBlock();
}

function getAddingScore(matchLineCount) {
  if (matchLineCount < 2) return matchLineCount;
  if (matchLineCount <= 3) return matchLineCount * 2;
  return matchLineCount * 5;
}

function getDificalty(score) {
  if (score < NOMAL_SCORE) return "easy";
  if (score < HARD_SCORE) return "nomal";
  if (score < HELL_SCORE) return "hard";
  return "hell";
}

function moveBlock(moveType, value) {
  tempMovingItem[moveType] += value;
  renderBlocks(moveType);
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}

function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);

  renderBlocks();
}

// Event handling
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowUp":
      changeDirection();
      break;
    case "ArrowRight":
      moveBlock("left", 1);
      break;
    case "ArrowLeft":
      moveBlock("left", -1);
      break;
    case "ArrowDown":
      moveBlock("top", 1);
      break;
    case "Space":
      dropBlock();
      break;
    default:
      break;
  }
});

restartButton.addEventListener("click", () => {
  reset();
});
