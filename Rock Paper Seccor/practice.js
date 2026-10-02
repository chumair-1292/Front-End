document.addEventListener('DOMContentLoaded', () => {
  let userScore = 0;
  let compScore = 0;

  const userScoreEl = document.getElementById('user-score');
  const compScoreEl = document.getElementById('comp-score');
  const msgEl = document.getElementById('msg');
  const choices = document.querySelectorAll('.choice-btn');

  // GENERATE RANDOM COMPUTER CHOICE
  const genCompChoice = () => {
    const options = ['rock', 'paper', 'scissors'];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
  };

  // HANDLE GAME DRAW
  const drawGame = () => {
    msgEl.textContent = "It's a draw!";
    msgEl.className = 'status-msg draw';
  };

  // SHOW WINNER & UPDATE SCORE
  const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
      userScore++;
      userScoreEl.textContent = userScore;
      msgEl.textContent = `You win! Your ${userChoice} beats ${compChoice}`;
      msgEl.className = 'status-msg win';
    } else {
      compScore++;
      compScoreEl.textContent = compScore;
      msgEl.textContent = `You lose! ${compChoice} beats your ${userChoice}`;
      msgEl.className = 'status-msg lose';
    }
  };

  // MAIN GAME LOGIC
  const playGame = (userChoice) => {
    const compChoice = genCompChoice();

    if (userChoice === compChoice) {
      drawGame();
    } else {
      let userWin = true;

      if (userChoice === 'rock') {
        userWin = compChoice === 'paper' ? false : true;
      } else if (userChoice === 'paper') {
        userWin = compChoice === 'scissors' ? false : true;
      } else { // scissors
        userWin = compChoice === 'rock' ? false : true;
      }

      showWinner(userWin, userChoice, compChoice);
    }
  };

  // EVENT LISTENERS FOR BUTTONS
  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const userChoice = choice.getAttribute('id');
      playGame(userChoice);
    });
  });
});