document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('resetBtn');

  let boardState = ["", "", "", "", "", "", "", "", ""];
  let isGameActive = true;

  const PLAYER = 'X';
  const COMP = 'O';

  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // CHECK WINNER
  const checkWin = (board, player) => {
    return WINNING_COMBOS.some(combo => {
      return combo.every(index => board[index] === player);
    });
  };

  // CHECK DRAW
  const checkDraw = (board) => {
    return board.every(cell => cell !== "");
  };

  // USER MOVE
  const handleCellClick = (e) => {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] !== "" || !isGameActive) return;

    makeMove(index, PLAYER);

    if (checkWin(boardState, PLAYER)) {
      statusEl.textContent = "You Win! 🎉";
      statusEl.style.backgroundColor = "#28a745"; // Green
      isGameActive = false;
      return;
    }

    if (checkDraw(boardState)) {
      statusEl.textContent = "It's a Draw!";
      statusEl.style.backgroundColor = "#081b29";
      isGameActive = false;
      return;
    }

    // COMPUTER TURN
    isGameActive = false;
    statusEl.textContent = "Comp is thinking...";

    setTimeout(() => {
      compTurn();
    }, 300);
  };

  // MAKE MOVE ON BOARD
  const makeMove = (index, player) => {
    boardState[index] = player;
    cells[index].textContent = player;
    cells[index].setAttribute('data-player', player);
    cells[index].disabled = true;
  };

  // IMPOSSIBLE COMPUTER TURN (MINIMAX AI)
  const compTurn = () => {
    let bestMove = getBestMoveMinimax(boardState);
    makeMove(bestMove, COMP);

    if (checkWin(boardState, COMP)) {
      statusEl.textContent = "You Lose! 😞";
      statusEl.style.backgroundColor = "#dc3545"; // Red
      isGameActive = false;
      return;
    }

    if (checkDraw(boardState)) {
      statusEl.textContent = "It's a Draw!";
      statusEl.style.backgroundColor = "#081b29";
      isGameActive = false;
      return;
    }

    statusEl.textContent = "Your Turn (X)";
    isGameActive = true;
  };

  // MINIMAX ALGORITHM (UNBEATABLE AI)
  const getBestMoveMinimax = (currentBoard) => {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === "") {
        currentBoard[i] = COMP;
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    if (checkWin(board, COMP)) return 10 - depth;
    if (checkWin(board, PLAYER)) return depth - 10;
    if (checkDraw(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = COMP;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = PLAYER;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // RESET GAME
  const resetGame = () => {
    boardState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusEl.textContent = "Your Turn (X)";
    statusEl.style.backgroundColor = "#081b29";

    cells.forEach(cell => {
      cell.textContent = "";
      cell.removeAttribute('data-player');
      cell.disabled = false;
    });
  };

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', resetGame);
});