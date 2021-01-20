'use strict'

const FLAG = '🚩';
const BOMB = '💣';
const SMILEY = '😃';
const WINNER = '😎';
const BLOW = '🤯';

var gBoard;
var gTimeInterval;
var gMouse;

var gLevel = {
    size: 4,
    Mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = SMILEY
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard(gBoard);
    setMinesNegsCount(1, 1, gBoard);
    var elTimer = document.querySelector('.time')
    elTimer.innerText = 'time:  ' + gGame.secsPassed;

};

function buildBoard() {
    var board = createMat(gLevel.size, gLevel.size);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                MinesAroundCount: setMinesNegsCount(i, j, board),
                isShown: false,
                isMine: false,
                isMarked: false
            };
            cell.isShown = true;
            board[i][j] = cell;
        }
    }
    board[getRandomInt(0, gLevel.size)][getRandomInt(0, gLevel.size)].isMine = true;
    board[getRandomInt(0, gLevel.size)][getRandomInt(0, gLevel.size)].isMine = true;
    return board;
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
            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">`;
            if ((currCell.isMine) && (!currCell.isShown)) strHtml += BOMB;
            else if (!currCell.isShown) {
                strHtml += setMinesNegsCount(i, j, board);
            }
            `</td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


function setMinesNegsCount(cellI, cellJ, mat) {
    var countNegs = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) countNegs++;
        }
    }
    if (countNegs === 0) countNegs = '';
    return countNegs;
};

function cellClicked(elCell) {
    if (gGame.shownCount === 0) {
        gTimeInterval = setInterval(timer, 1000)
    }
    var location = getCellLocationById(elCell.id);
    var cell = gBoard[location.i][location.j];
    cell.isShown = false;
    renderBoard(gBoard);
    if (!elCell.classList.contains('clicked')) gGame.shownCount++
        if (cell.isMine) gameOver();
    if (gGame.shownCount === 16) victory();
    if (gMouse === 3) {
        console.log('sof sof!')
    }
};

function cellMarked(elCell) {

}

function checkGameOver() {
    if (gGame.shownCount = 16) {
        victory();
    }
    if (BOMB) {
        gameOver();
    }
};

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
    gGame.shownCount = 0;
    init()
}

function gameOver() {
    console.log('game over!');
    clearInterval(gTimeInterval)
    gTimeInterval = null;
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = BLOW;
}

function victory() {
    console.log('victory!');
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = WINNER;
}

function timer() {
    var elTimer = document.querySelector('.time')
    elTimer.innerText = 'time:  ' + gGame.secsPassed++;
}

function whichButton(event) {
    if (event.which === 3) {
        console.log('right clicked!');
        gMouse = true;
        document.addEventListener('contextmenu', event => event.preventDefault(true));
        return true;
    } else return false;
}