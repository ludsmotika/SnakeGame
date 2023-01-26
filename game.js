import { html } from 'https://unpkg.com/lit-html?module';
import { getDanielScore } from './firebase.js';

const width = 800;
const height = 700;
const gridCol = 20;
const gridRow = 20;

const colTickness = width / gridCol;
const rowTickness = height / gridRow;

let canvas;
let canvasContext;

//the whole body of the snake by coordinations
let snakeCoordinations = [[9, 2], [9, 3], [9, 4]];

//queue for adding the requested directions by the player 
let directionsQueue = [];

//default direction
let direction = 'right';

var matrix = [];

//creating and filling the matrix with empty values
for (var i = 0; i < 20; i++) {
    matrix[i] = new Array(20);
}

let currentAppleCoordinations = [];

let appleImage = new Image();
appleImage.src = './resources/apple.png';

let gameCycle;
let level = 1;

let scoreBlock;
let score = 0;



//showing the current element to the user (the canva)
let canvasTemplate = (playGame) => html`  <canvas id="canvas" width="800" height="700"></canvas> <button @click=${playGame} id="begin" width = "200" height="40" style="position:absolute; top:46%; left:36%">Click To Start</button>`;

export async function showGame(ctx) {
    ctx.render(canvasTemplate(playGame));

    canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */

    canvasContext = canvas.getContext('2d');

    canvasContext.beginPath();
    canvasContext.fillStyle = '#8CCD4A';
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.closePath();

    canvasContext.stroke();

    clearGameVariables();

    drawGrid();
}

window.addEventListener('popstate', (e) => {
    clearGameVariables();
    clearInterval(gameCycle);
})

document.addEventListener('keydown', (e) => {

    switch (e.key) {
        case "ArrowUp":
            directionsQueue.push('up');
            break;
        case "ArrowDown":
            directionsQueue.push('down');
            break;
        case "ArrowLeft":
            directionsQueue.push('left');
            break;
        case "ArrowRight":
            directionsQueue.push('right');
            break;
        default:
            break;
    }


    if (directionsQueue.length > 3) {
        directionsQueue = directionsQueue.splice(3);
    }
});




//staring the game
function playGame() {

    let mainElement = document.getElementById('main');
    //showing the pause button and the score div

    let scoreDiv = document.createElement('div');
    scoreDiv.setAttribute('id', 'scoreBlock');
    scoreDiv.textContent = 'Score: 0';
    scoreBlock = scoreDiv;

    let pauseButton = document.createElement('button');
    pauseButton.setAttribute('id', 'pauseButton');
    pauseButton.setAttribute('style', 'position:absolute; left:5%; top:10%; width: 200px;');
    pauseButton.textContent = 'pause';
    pauseButton.addEventListener('click', (e) => {

        e.target.disabled = true;
        clearInterval(gameCycle);

        //visualing the pause menu while game is stopped
        showPauseMenu(mainElement);
    });


    mainElement.appendChild(scoreDiv);
    mainElement.appendChild(pauseButton);

    directionsQueue = [];
    gameCycle = setInterval(drawScene, 300);
    let beginButton = document.getElementById('begin');
    beginButton.remove();
}

function drawScene() {
    clearCanva();
    clearMatrix();
    drawGrid();
    changeDirection();
    checkApples();
    doNextMove(direction, snakeCoordinations);
    drawSnake();
}

function changeDirection() {
    let nextDirection = directionsQueue.shift();
    if (nextDirection != undefined) {
        if ((direction == 'up' && nextDirection == 'down') || (direction == 'down' && nextDirection == 'up') || (direction == 'left' && nextDirection == 'right') || (direction == 'right' && nextDirection == 'left')) {
            changeDirection();
        }
        else {
            direction = nextDirection;
        }
    }
}




function changeHeadCordinations(headCoordinations, direction) {


    switch (direction) {
        case "right":
            headCoordinations[1] += 1;
            if (headCoordinations[1] >= 20) {
                headCoordinations[1] = 0;
            }
            break;
        case "left":
            headCoordinations[1] -= 1;
            if (headCoordinations[1] < 0) {
                headCoordinations[1] = 19;
            }
            break;
        case "up":
            headCoordinations[0] -= 1;
            if (headCoordinations[0] < 0) {
                headCoordinations[0] = 19;
            }
            break;
        case "down":
            headCoordinations[0] += 1;
            if (headCoordinations[0] >= 20) {
                headCoordinations[0] = 0;
            }
            break;
    }
}




function doNextMove(direction, snakeCoordinations) {

    let headCoordinations = snakeCoordinations[snakeCoordinations.length - 1].slice(0);

    changeHeadCordinations(headCoordinations, direction);

    //check if you have eaten an apple
    if (matrix[headCoordinations[0]][headCoordinations[1]] != 'A') {
        snakeCoordinations.shift();
    }
    else if (matrix[headCoordinations[0]][headCoordinations[1]] == 'A') {
        currentAppleCoordinations = [];
        score += 20;
        scoreBlock.textContent = `Score: ${score}`;

        //logic for making the game harder after a certain apples count been eaten
        if (score == 200) {
            clearInterval(gameCycle);
            gameCycle = setInterval(drawScene, 200);
            level = 2;
        }
        else if (score == 400) {
            clearInterval(gameCycle);
            gameCycle = setInterval(drawScene, 100);
            level = 3;
        }
        else if (score == 600) {
            clearInterval(gameCycle);
            gameCycle = setInterval(drawScene, 70);
            level = 4;
        }

    }

    let isCrossing = snakeCoordinations.find(x => x[0] == headCoordinations[0] && x[1] == headCoordinations[1]);

    if (isCrossing != undefined) {
        clearInterval(gameCycle);
        showGameOverMenu();
    }

    snakeCoordinations.push([headCoordinations[0], headCoordinations[1]]);
}




function checkApples() {

    if (currentAppleCoordinations.length != 0) {
        matrix[currentAppleCoordinations[0]][currentAppleCoordinations[1]] = 'A';
        canvasContext.drawImage(appleImage, currentAppleCoordinations[1] * colTickness, currentAppleCoordinations[0] * rowTickness, colTickness, rowTickness);
        return;
    }

    let freePlaces = [];

    for (let p = 0; p < 20; p++) {
        for (let k = 0; k < 20; k++) {

            if (snakeCoordinations.find(x => x[0] == p && x[1] == k) == undefined) {
                freePlaces.push([p, k]);
            }

        }
    }

    let newAppleCoordinations = freePlaces[Math.floor(Math.random() * (freePlaces.length - 0 + 1)) + 0];
    currentAppleCoordinations = [newAppleCoordinations[0], newAppleCoordinations[1]];
}





//drawing methods


function drawSnake() {

    for (let currentPart of snakeCoordinations) {
        matrix[currentPart[0]][currentPart[1]] = 'S';
    }

    for (let i = 0; i < 20; i++) {

        for (let k = 0; k < 20; k++) {

            if (matrix[i][k] == 'S') {

                canvasContext.beginPath();
                canvasContext.fillStyle = '#000000';
                canvasContext.fillRect(k * colTickness, i * rowTickness, colTickness, rowTickness);
                canvasContext.closePath();
                canvasContext.stroke();
            }
        }
    }
}





function drawGrid() {

    canvasContext.strokeStyle = 'grey';
    canvasContext.lineWidth = 0.5;

    for (let i = 1; i < gridCol; i++) {
        canvasContext.beginPath();
        canvasContext.moveTo(i * colTickness, 0);
        canvasContext.lineTo(i * colTickness, 700);
        canvasContext.closePath();
        canvasContext.stroke();
    }
    for (let k = 1; k < gridRow; k++) {
        canvasContext.beginPath();
        canvasContext.moveTo(0, k * rowTickness);
        canvasContext.lineTo(800, k * rowTickness);
        canvasContext.closePath();
        canvasContext.stroke();
    }

}




//clearing methods for the canva and the matrix

function clearCanva() {

    canvasContext.clearRect(0, 0, width, height);

    canvasContext.beginPath();
    canvasContext.fillStyle = '#8CCD4A';
    canvasContext.fillRect(0, 0, width, height);
    canvasContext.closePath();

    canvasContext.stroke();
}



function clearMatrix() {
    for (let i = 0; i < 20; i++) {
        for (let k = 0; k < 20; k++) {
            matrix[i][k] = undefined;
        }
    }
}



function clearGameVariables() {

    snakeCoordinations = [[9, 2], [9, 3], [9, 4]];
    directionsQueue = [];
    direction = 'right';
    currentAppleCoordinations = [];
    score = 0;
    level = 1;
}




//menus

function showPauseMenu(mainElement) {

    let pauseMenuDiv = document.createElement('div');

    pauseMenuDiv.setAttribute('id', 'pauseMenu');
    pauseMenuDiv.textContent = 'Pause Menu';

    let resumeButton = document.createElement('button');
    resumeButton.textContent = 'Resume Game';
    resumeButton.setAttribute('style', 'position: absolute; left:16%; top: 30%;');
    resumeButton.addEventListener('click', (e) => {

        e.target.parentElement.remove();
        document.getElementById('pauseButton').disabled = false;

        directionsQueue = [];
        let intervalTime = 0;

        if (level == 1) {
            intervalTime = 300;
        }
        else if (level == 2) {
            intervalTime = 200;
        }
        else if (level == 3) {
            intervalTime = 100;
        }
        else if (level == 4) {
            intervalTime = 70;
        }

        gameCycle = setInterval(drawScene, intervalTime);
    });

    let quitButton = document.createElement('a');

    quitButton.textContent = 'Quit Game';
    quitButton.setAttribute('style', 'position: absolute; left:16%; top: 60%;');
    quitButton.setAttribute('href', '/');

    quitButton.addEventListener('click', () => {
        clearGameVariables();
    });


    pauseMenuDiv.appendChild(resumeButton);
    pauseMenuDiv.appendChild(quitButton);

    mainElement.appendChild(pauseMenuDiv);
}


function showGameOverMenu() {
    let gameOverDiv = document.createElement('div');
    gameOverDiv.setAttribute('id', 'gameOverDiv');
    gameOverDiv.textContent = "Game Over!";


    let restartGameButton = document.createElement('button');
    restartGameButton.setAttribute('id', 'restartGameButton');
    restartGameButton.setAttribute('style', 'position: absolute; left:20%; top:50%;');
    restartGameButton.textContent = `Restart Game`;
    restartGameButton.addEventListener('click', (e) => {

        clearGameVariables();
        document.getElementById('scoreBlock').textContent = "Score: 0";

        gameCycle = setInterval(drawScene, 300);

        e.target.parentElement.remove();
    });

    gameOverDiv.appendChild(restartGameButton);
    let mainElement = document.getElementById('main');
    mainElement.appendChild(gameOverDiv);
}



//
