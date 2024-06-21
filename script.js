const X_CLASS = 'x';
const O_CLASS = 'o';

let currentPlayer = X_CLASS;
let humanPlayer = X_CLASS;
let aiPlayer = O_CLASS;
let gameMode = 'multiplayer'; 


let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;


const statusMessage = document.getElementById('status-message');
const restartButton = document.getElementById('restart-button');

function initializeGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = X_CLASS;
    gameActive = true;
    statusMessage.innerText = `Player ${currentPlayer === X_CLASS ? 'X' : 'O'}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    if (gameMode === 'singleplayer' && currentPlayer === aiPlayer) {
        aiMakeMove();
    }
}
function handleClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (!gameActive || gameState[clickedCellIndex] !== '') return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    if (checkWin(gameState, currentPlayer)) {
        endGame(false);
    } else if (!gameState.includes('')) {
        endGame(true); 
    } else {
        currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
        statusMessage.innerText = `Player ${currentPlayer === X_CLASS ? 'X' : 'O'}'s turn`;
        if (gameMode === 'singleplayer' && currentPlayer === aiPlayer) {
            setTimeout(aiMakeMove, 1000); 
        }
    }
}
function aiMakeMove() {
    let emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let aiMove = emptyCells[randomIndex];

    gameState[aiMove] = aiPlayer;
    let aiCell = document.querySelector(`.cell[data-cell-index="${aiMove}"]`);
    aiCell.classList.add(aiPlayer);

    if (checkWin(gameState, aiPlayer)) {
        endGame(false); 
    } else if (!gameState.includes('')) {
        endGame(true); 
    } else {
        currentPlayer = humanPlayer;
        statusMessage.innerText = `Player ${currentPlayer === X_CLASS ? 'X' : 'O'}'s turn`;
    }
}
function checkWin(board, player) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winConditions.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function endGame(isDraw) {
    gameActive = false;
    if (isDraw) {
        statusMessage.innerText = "It's a draw!";
    } else {
        statusMessage.innerText = `Player ${currentPlayer === X_CLASS ? 'X' : 'O'} wins!`;
        
    }
}

restartButton.addEventListener('click', initializeGame);
document.querySelectorAll('input[name="mode"]').forEach(mode => {
    mode.addEventListener('change', function() {
        gameMode = this.value;
        initializeGame();
    });
});
initializeGame();

