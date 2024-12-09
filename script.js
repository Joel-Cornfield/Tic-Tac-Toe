// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, mark) => {
        if (board[index] === "") board[index] = mark;
    };

    const resetBoard = () => {
        board.fill("");
    };

    return { getBoard, updateBoard, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let player1, player2, currentPlayer;
    let gameOver = false;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.setMessage(`${currentPlayer.name}'s turn!`);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
            [0, 4, 8], [2, 4, 6],             // diagonals
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes("") ? null : "Tie";
    };

    const playRound = (index) => {
        if (gameOver || Gameboard.getBoard()[index] !== "") return;

        Gameboard.updateBoard(index, currentPlayer.marker);
        DisplayController.renderBoard();

        const result = checkWinner();
        if (result) {
            gameOver = true;
            DisplayController.setMessage(
                result === "Tie" ? "It's a tie!" : `${currentPlayer.name} wins!`
            );
        } else {
            switchPlayer();
            DisplayController.setMessage(`${currentPlayer.name}'s turn!`);
        }
    };

    return { startGame, playRound };
})();

// Display Controller Module
const DisplayController = (() => {
    const boardContainer = document.querySelector(".board");
    const messageContainer = document.querySelector(".message");

    const renderBoard = () => {
        boardContainer.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;

            // Set Color Based on Player
            if (mark === "X") cell.classList.add("player-one");
            if (mark === "O") cell.classList.add("player-two");

            cell.addEventListener("click", () => GameController.playRound(index));
            boardContainer.appendChild(cell);
        });
    };

    const setMessage = (message) => {
        messageContainer.textContent = message;
    };

    return { renderBoard, setMessage };
})();

// Start Button Event Listener
document.getElementById("start-btn").addEventListener("click", () => {
    const name1 = document.getElementById("player1").value || "Player 1";
    const name2 = document.getElementById("player2").value || "Player 2";
    GameController.startGame(name1, name2);
});

// Ensure Board Is Ready
document.addEventListener("DOMContentLoaded", () => {
    DisplayController.renderBoard();
});
