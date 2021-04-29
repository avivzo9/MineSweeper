'use strict'

const FLAG = '🚩';
const BOMB = '💣';
const SMILEY = '😃';
const WINNER = '😎';
const BLOW = '🤯';
const EMPTY = '';

var gBoard;
var gTimeInterval;
var gLives = 3;
var countClick = 0;
var gMinesNegsCount;
var gMinesVictoryCount = 0;


var gLevel = {
    size: 4,
    mines: 2
};

var gMinesCount;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function init() {
    gMinesCount = gLevel.mines;
    countClick = 0;
    minesLeftDisplay();
    clearInterval(gTimeInterval);
    gLives = 3;
    gTimeInterval = null;
    gGame.secsPassed = 0
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    var elMineLeft = document.querySelector('.mines-left');
    elMineLeft.innerText = '💣 mines left: ' + gMinesCount;
    var elLives = document.querySelector('.lives');
    elLives.innerText = '💔 lives: ' + gLives;
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = SMILEY;
    var elTimer = document.querySelector('.time');
    elTimer.innerText = '⏱ time:  ' + gGame.secsPassed;
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard(gBoard);
};

function buildBoard() {
    var board = createMat(gLevel.size, gLevel.size);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: EMPTY,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            cell.isShown = true;
            board[i][j] = cell;
        }
    }
    return board;
}


function createBombs(board, mineNum) {
    var mineCount = 0;
    while (mineCount < mineNum) {
        var randI = getRandomInt(0, gLevel.size);
        var randJ = getRandomInt(0, gLevel.size);
        if (!board[randI][randJ].isMine && board[randI][randJ].isShown) {
            board[randI][randJ].isMine = true;
            mineCount++;
        }
    }
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var currCell = board[i][j];
            var tdId = `cell-${i}-${j}`;
            var className = (currCell.isShown) ? 'cell' : 'clicked';
            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)"
            onmousedown="handleRightMouseClick(event, this)">`;
            if (countClick >= 1) {
                if ((currCell.isMine) && (!currCell.isShown)) strHtml += BOMB;
                if (!currCell.isShown) {
                    gMinesNegsCount = setMinesNegsCount(i, j, board);
                    strHtml += gMinesNegsCount;
                    gBoard[i][j].minesAroundCount = gMinesNegsCount;
                }
            }
            if (currCell.isMarked) strHtml += FLAG;

            `</td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
    checkVictory()
}

function setMinesNegsCount(cellI, cellJ, board) {
    if (countClick >= 1) {
        var countNegs = 0;
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i === cellI && j === cellJ) continue;
                if (j < 0 || j >= board[i].length) continue;
                if (board[cellI][cellJ].isMine) continue;
                if (board[i][j].isMine) countNegs++;
                var currCell = board[i][j];
            }
        }
        if (!countNegs) return countNegs = EMPTY;
        else {
            currCell.minesAroundCount = countNegs;
            return countNegs;
        }
    }
};

function cellClicked(elCell) {
    if (!gGame.isOn) return;
    countClick++;
    var location = getCellLocationById(elCell.id);
    var cell = gBoard[location.i][location.j];
    if (cell.isMarked) return;
    if (countClick === 1) {
        gTimeInterval = setInterval(timer, 1000);
        createBombs(gBoard, gLevel.mines);
        if (cell.isMine) {
            cell.isMine = false;
            createBombs(gBoard, 1);
        }
    }
    cell.isShown = false;
    if (!elCell.classList.contains('clicked')) ++gGame.shownCount;
    if (cell.isMine) {
        var elMineLeft = document.querySelector('.mines-left');
        elMineLeft.innerText = '💣 mines left: ' + --gMinesCount;
        --gLives;
        if (gLives === 0) minesReveal(gBoard);
        ++gGame.markedCount;
        var elLives = document.querySelector('.lives');
        elLives.innerText = '💔 lives: ' + gLives;
        if (gLives === 0) {
            gameOver();
        }
    }
    if (cell.minesAroundCount === EMPTY) expandShown(gBoard, location.i, location.j);
    renderBoard(gBoard);
};

function handleRightMouseClick(event, elCell) {
    if (event.which === 3) {
        document.addEventListener('contextmenu', event => event.preventDefault(true));
        if (!gGame.isOn) return;
        var location = getCellLocationById(elCell.id);
        var cell = gBoard[location.i][location.j];
        if (cell.isMarked) {
            if (elCell.classList.contains('clicked')) return;
            cell.isMarked = false;
            --gGame.markedCount;
            var elMineLeft = document.querySelector('.mines-left');
            elMineLeft.innerText = '💣 mines left: ' + ++gMinesCount;
        } else if (!cell.isMarked) {
            if (elCell.classList.contains('clicked')) return;
            cell.isMarked = true;
            ++gGame.markedCount;
            var elMineLeft = document.querySelector('.mines-left');
            elMineLeft.innerText = '💣 mines left: ' + --gMinesCount;
        }
        renderBoard(gBoard);
        return;
    } else return;
}

function createMat(ROWS, COLS) {
    var mat = [];
    for (var i = 0; i < ROWS; i++) {
        var row = [];
        for (var j = 0; j < COLS; j++) {
            row.push('');
        }
        mat.push(row);
    }
    return mat;
}

function getCellLocationById(cellId) {
    var cell = cellId.split('-')
    var location = { i: +cell[1], j: +cell[2] };
    return location;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function restartGame() {
    console.clear();
    clearInterval(gTimeInterval)
    gTimeInterval = null;
    init();
}

function gameOver() {
    console.log('game over!');
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = BLOW;
    gGame.isOn = false;
    clearInterval(gTimeInterval)
    gTimeInterval = null;
}

function victory() {
    console.log('victory!');
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = WINNER;
    gGame.isOn = false;
    clearInterval(gTimeInterval);
    gTimeInterval = null;
}

function timer() {
    var elTimer = document.querySelector('.time');
    elTimer.innerText = '⏱ time: ' + ++gGame.secsPassed;
}

function gameLevels(elButton) {
    if (elButton.classList.contains('easy-button')) {
        console.log('easy');
        gLevel = {
            size: 4,
            mines: 2
        };
    } else if (elButton.classList.contains('hard-button')) {
        console.log('hard');
        gLevel = {
            size: 8,
            mines: 12
        };
    } else if (elButton.classList.contains('expert-button')) {
        console.log('expert');
        gLevel = {
            size: 12,
            mines: 30
        };
    }
    console.clear();
    clearInterval(gTimeInterval)
    gTimeInterval = null;
    init();
}

function minesReveal(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                if (board[i][j].isMarked) continue;
                else board[i][j].isShown = false;
            }
        }
    }
}

function expandShown(board, i, j) {
    for (var rowI = i - 1; rowI <= i + 1; rowI++) {
        if (rowI < 0 || rowI >= board.length) continue;
        for (var colJ = j - 1; colJ <= j + 1; colJ++) {
            if (colJ < 0 || colJ >= board[0].length) continue;
            if (rowI === i && colJ === j) continue;
            var currCell = board[rowI][colJ];
            if (currCell.isMarked) return;
            if (currCell.isMine) continue;
            if (!currCell.isShown) continue;
            currCell.isShown = false;
            ++gGame.shownCount;
        }
    }
}

function minesLeftDisplay() {
    var elMineLeft = document.querySelector('.mines-left')
    elMineLeft.innerText = 'mines left: ' + gMinesCount;
}

function checkVictory() {
    var shownCountVictory = ((gLevel.size * gLevel.size) - gLevel.mines);
    var markedCountVictory = gLevel.mines;
    if (gGame.shownCount >= shownCountVictory && gGame.markedCount === markedCountVictory) victory();
}