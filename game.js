class Puissance4 {
    constructor(options){
        // Simple scoreboard
        this.score = { red: 0, yellow: 0 };

        this.scoreboard = document.createElement("div");
        this.scoreboard.classList.add("scoreboard");
        this.scoreboard.style.textAlign = "center";
        this.scoreboard.style.fontWeight = "bold";
        this.scoreboard.style.margin = "1em";

        this.options = {options};
        // Even playerState = Player 1, Odd = Player 2
        this.playerState = 0;
        // History of moves for undo
        this.moves = [];
        // Flag to stop the game
        this.isGameOver = false;

        document.body.insertBefore(this.scoreboard, document.body.firstChild);
        this.updateScoreboard();
        this.init();
    }

    updateScoreboard(){
        this.scoreboard.innerHTML = 
          `Score - Player 1 (Red): ${this.score.red} | Player 2 (Yellow): ${this.score.yellow}`;
    }
    
    init(){
        this.run();
    }
    
    run(){
        this.welcome();
        const button = document.querySelector(".playButton");
        button.addEventListener("click",() => {
            button.remove();
            this.displayBoard();
        });
    }
    
    welcome(){
        const welcome = document.createElement("div");
        welcome.classList.add("welcome");

        const button = document.createElement("button");
        button.classList.add("playButton");
        button.textContent = "Play";

        welcome.innerHTML = 
        `<h1 style='text-align:center;'>Welcome to the Connect4 game :)</h1>
         <div id='welcome' style='display:flex;justify-content:center;margin-bottom:1%;'></div>`;
        
        document.body.appendChild(welcome);
        document.getElementById("welcome").appendChild(button);
    }

    checkPlayer(pState){
        const playerState = document.createElement("h3");
        playerState.classList.add("statePlayer");
        playerState.style.textAlign = "center";

        if (pState % 2 === 0){
            playerState.innerHTML = "Player 1";
            document.querySelector(".welcome").appendChild(playerState);
            return "even";
        } 
        playerState.innerHTML = "Player 2";
        document.querySelector(".welcome").appendChild(playerState);
        return "odd";
    }

    displayBoard(){
        const board = document.createElement("div");
        board.classList.add("board");
        this.styliseBoard(board);
        document.body.appendChild(board);
        document.body.style.height = "100vh";

        for (let i = 0; i < 42; i++){
            const token = document.createElement("div");
            token.classList.add("token-field");
            token.id = i;
            token.style.cursor = "pointer";
            token.style.width = "50%";
            token.style.height = "50%";
            token.style.borderRadius = "50%";
            token.style.border = "1px solid";
            token.style.backgroundColor = "gray";
            board.appendChild(token);
        }
        
        const undoButton = document.createElement("button");
        undoButton.classList.add("undoButton");
        undoButton.style.display = "none";
        undoButton.style.margin = "auto";
        undoButton.textContent = "Undo Last Move";
        document.querySelector(".welcome").appendChild(undoButton);
        
        undoButton.addEventListener("click", () => {
            if (this.isGameOver) return;
            if(this.moves.length > 0){
                const lastId = this.moves.pop();
                const slot = document.getElementById(String(lastId));
                slot.style.backgroundColor = "gray";
                slot.style.cursor = "pointer";
                document.querySelector("h3").remove();
                this.playerState--;
                this.checkPlayer(this.playerState);
            }
        });
        
        this.renderSwitch();
    }

    renderSwitch() {
        const tokens = document.querySelectorAll(".token-field");
        const undoButton = document.querySelector(".undoButton");
        
        this.checkPlayer(this.playerState);
        
        tokens.forEach(token => {
            token.addEventListener("click", () => {
                if (this.isGameOver) return;
                undoButton.style.display = "block";

                if (token.style.backgroundColor === "gray"){
                    const column = parseInt(token.id) % 7;
                    let lastId;
                    
                    for(let i = column; i < 42; i += 7){
                        lastId = i;
                    }
                    for(lastId; lastId >= 1; lastId -= 7){
                        const slot = document.getElementById(String(lastId)); 
                        if(slot.style.backgroundColor === "gray"){
                            if (this.checkPlayer(this.playerState) === "even"){
                                slot.style.backgroundColor = "red";
                            } else {
                                slot.style.backgroundColor = "yellow";
                            }
                            slot.style.cursor = "default";
                            this.moves.push(lastId);
                            break;
                        }
                    }
                    document.querySelector("h3").remove();  
                    this.playerState++;
                    this.checkEnd();
                }
            });
        });
    }

    // Checks all possible win conditions
    checkEnd() {
        const tokens = document.querySelectorAll(".token-field");
        let foundWinner = false;
        
        tokens.forEach(token => {
            if (token.style.backgroundColor !== "gray") {
                let id = parseInt(token.id);
                let color = token.style.backgroundColor;

                if (id % 7 <= 3) { 
                    if (
                        document.getElementById(id + 1)?.style.backgroundColor === color &&
                        document.getElementById(id + 2)?.style.backgroundColor === color &&
                        document.getElementById(id + 3)?.style.backgroundColor === color
                    ) {
                        foundWinner = true;
                        this.gameOver(color);
                        return;
                    }
                }
                if (id < 21) { 
                    if (
                        document.getElementById(id + 7)?.style.backgroundColor === color &&
                        document.getElementById(id + 14)?.style.backgroundColor === color &&
                        document.getElementById(id + 21)?.style.backgroundColor === color
                    ) {
                        foundWinner = true;
                        this.gameOver(color);
                        return;
                    }
                }
                if (id % 7 >= 3 && id < 21) { 
                    if (
                        document.getElementById(id + 6)?.style.backgroundColor === color &&
                        document.getElementById(id + 12)?.style.backgroundColor === color &&
                        document.getElementById(id + 18)?.style.backgroundColor === color
                    ) {
                        foundWinner = true;
                        this.gameOver(color);
                        return;
                    }
                }
                if (id % 7 <= 3 && id < 21) {
                    if (
                        document.getElementById(id + 8)?.style.backgroundColor === color &&
                        document.getElementById(id + 16)?.style.backgroundColor === color &&
                        document.getElementById(id + 24)?.style.backgroundColor === color
                    ) {
                        foundWinner = true;
                        this.gameOver(color);
                        return;
                    }
                }
            }
        });

        // If no winner, check for a draw
        if(!foundWinner){
            const boardFull = Array.from(tokens).every(t => t.style.backgroundColor !== "gray");
            if(boardFull){
                this.gameOver("draw");
            }
        }
    }

    gameOver(result){
        this.isGameOver = true;
        const winBox = document.createElement("div");
        document.querySelector(".statePlayer").remove();
        
        let message = "<h2 style='color:red;text-align:center;'>GAME OVER !!</h2>";
        
        if(result === "draw"){
            message += "<h3 style='text-align:center;'>No more moves left, it's a draw!</h3>";
        } else if(result === "red"){
            this.score.red++;
            this.updateScoreboard();
            message += "<h3 style='text-align:center;'>Player 1 wins!</h3>";
        } else {
            this.score.yellow++;
            this.updateScoreboard();
            message += "<h3 style='text-align:center;'>Player 2 wins!</h3>";
        }
        
        message += "<div style='text-align:center; margin-top:1em;'><button class='reloadButton'>Reload</button></div>";
        winBox.innerHTML = message;
        document.querySelector(".welcome").appendChild(winBox);

        document.querySelectorAll(".token-field").forEach(token => {
            token.style.cursor = "default";
        });

        const undoButton = document.querySelector(".undoButton");
        if(undoButton){
            undoButton.remove();
        }

        document.querySelector(".reloadButton").addEventListener("click", () => {
            this.reloadGame();
        });
    }

    reloadGame(){
        this.isGameOver = false;
        this.moves = [];
        this.playerState = 0;

        const board = document.querySelector(".board");
        if(board){
            board.remove();
        }

        const resultBox = document.querySelector(".reloadButton")?.parentNode?.parentNode;
        if(resultBox){
            resultBox.remove();
        }

        const oldPlayerState = document.querySelector(".statePlayer");
        if(oldPlayerState){
            oldPlayerState.remove();
        }

        this.displayBoard();
    }

    // Grid layout and styling for the board
    styliseBoard(board){
        board.style.display = "grid";
        board.style.gridTemplateRows = "repeat(6,1fr)";
        board.style.gridTemplateColumns = "repeat(7,1fr)";
        board.style.justifyContent = "space-evenly";
        board.style.justifyItems = "center";
        board.style.alignContent = "space-evenly";
        board.style.alignItems = "center";
        board.style.backgroundColor = "rgb(96, 96, 246)";
        board.style.padding = "2%";
        board.style.width = "700px";
        board.style.height = "600px";
        board.style.margin = "auto";
        board.style.border = "2px solid";
        board.style.borderRadius = "2%";
        board.style.boxShadow = "1px 5px 5px black";
        board.style.boxSizing = "border-box";
    }
}

new Puissance4();
