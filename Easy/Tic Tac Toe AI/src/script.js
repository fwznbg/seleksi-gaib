let humanPlayer = "";
let aiPlayer = "";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isFull = false; // is the board full

const choose = document.querySelector(".choose");
const game = document.querySelector(".game");
const winner_statement = document.querySelector(".winner--container");
const winner = document.querySelector("#winner");
const chooseX = document.querySelector(".choose--x");
const chooseO = document.querySelector(".choose--o");
const resetButton = document.querySelector("#hidden--button");
const winnerReset = document.querySelector(".winner--button");

const renderBoard = (board) => {
  game.innerHTML = ""
  board.forEach((e, i) => {
    game.innerHTML += `<div id="blok${i}" class="blok" onclick="humanMove(${i})">${board[i]}</div>`
    if (e == "X" || e == "O") {
      document.querySelector(`#blok${i}`).classList.add("occupied");
    }
  });
  winner_statement.style.visibility = "hidden";
};

const isBoardFull = (board) => {
  let flag = true;
  board.forEach(element => {
    if (element != humanPlayer && element != aiPlayer) {
      flag = false;
    }
  });
  isFull = flag;
  return isFull;
};

const checkLine = (board, a, b, c) => {
  return (
    board[a] == board[b] &&
    board[b] == board[c] &&
    (board[a] == humanPlayer || board[a] == aiPlayer)
  );
};

const checkWinner = (board) => {
  for (i = 0; i < 9; i += 3) {
    if (checkLine(board, i, i + 1, i + 2)) {
      return board[i];
    }
  }
  for (i = 0; i < 3; i++) {
    if (checkLine(board, i, i + 3, i + 6)) {
      return board[i];
    }
  }
  if (checkLine(board, 0, 4, 8)) {
    return board[0];
  }
  if (checkLine(board, 2, 4, 6)) {
    return board[2];
  }
  if(isBoardFull(board)){ //draw
    return 0;
  }
  return "";
};

const checkFinalState = (board) => {
  let res = checkWinner(board);
  if (res == humanPlayer) {
    winner.innerText = "You Win!";
    isFull = true
    winner_statement.style.visibility = "visible";
    return true;
  } else if (res == aiPlayer) {
    winner.innerText = "Computer Win!";
    isFull = true
    winner_statement.style.visibility = "visible";
    return true;
  } else if (isBoardFull(board)) {
    winner.innerText = "Draw!";
    winner_statement.style.visibility = "visible";
    return true;
  }
  return false;
};


const resetBoard = () => {
  humanPlayer = "";
  aiPlayer = "";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  isFull = false;
  winner.innerText = "";
  renderBoard(gameBoard);
  choose.style.visibility = "visible";
  document.getElementById("hidden--button").style.visibility = "hidden";
};

resetButton.addEventListener("click", resetBoard);
winnerReset.addEventListener("click", resetBoard);

const x_button = () => {
  winner_statement.style.visibility = 'hidden';
  document.getElementById("hidden--button").style.visibility = "visible";
}

const game_loop = (board) => {
  renderBoard(board);
  isBoardFull(board);
  return checkFinalState(board);
}

const minimax = (board, depth, isMax) => {
  let winner = checkWinner(board);
  if (winner !== "") {
    if(winner == aiPlayer) return 10-depth;
    else if (winner == humanPlayer) return depth-10;
    return 0;
  }

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, !isMax);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] == "") {
        board[i] = humanPlayer;
        let score = minimax(board, depth + 1, isMax);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


const humanMove = (e) => {
  if (!isFull && gameBoard[e] == "" && humanPlayer != "") {
    gameBoard[e] = humanPlayer;
    if(!game_loop(gameBoard)) aiMove();
  }
};

const aiMove = () => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] == "") {
      gameBoard[i] = aiPlayer;
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  gameBoard[move] = aiPlayer;
  game_loop(gameBoard);
}


chooseX.addEventListener("click", function(){
  humanPlayer = "X";
  aiPlayer = "O";
  choose.style.visibility = "hidden";
});

chooseO.addEventListener("click", function(){
  humanPlayer = "O";
  aiPlayer = "X";
  choose.style.visibility = "hidden";
  aiMove();
});
    

renderBoard(gameBoard);