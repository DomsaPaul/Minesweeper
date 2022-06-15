let board = [];
let rows = 8;
let columns = 8;

let minesCount = 5;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    minesLocation.push("2-2");
    minesLocation.push("2-3");
    minesLocation.push("5-6");
    minesLocation.push("3-4");
    minesLocation.push("1-1");
}

function  startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }else{
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        alert("Game Over");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                 tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) { 
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minseFound = 0;
    //top 3
    minseFound += checkTile(r-1, c-1);
    minseFound += checkTile(r-1, c);
    minseFound += checkTile(r-1, c+1);
    //left and right
    minseFound += checkTile(r, c-1);
    minseFound += checkTile(r, c+1);
    //bottom 3
    minseFound += checkTile(r+1, c-1);
    minseFound += checkTile(r+1, c);
    minseFound += checkTile(r+1, c+1);

    if (minseFound > 0) {
        board[r][c].innerText = minseFound;
        board[r][c].classList.add("x" + minseFound.toString());
    } else {
        //top 3
        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);
        //left and right
        checkMine(r, c-1);
        checkMine(r-1, c+1);
        //bottom 3
        checkMine(r+1, c-1);
        checkMine(r-1, c);
        checkMine(r+1, c+1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) { 
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString()+ "-" + c.toString())) {
        return 1;
    }
    return 0;
}