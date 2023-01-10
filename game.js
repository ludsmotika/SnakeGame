import { html } from 'https://unpkg.com/lit-html?module';

const width = 800;
const height = 700;
const gridCol = 20;
const gridRow = 20;

const colTickness = width / gridCol;
const rowTickness = height / gridRow;

let canvas;
let canvasContext;

//the whole body of the snake by coordinations
let snakeCoordinations = [[11, 2], [11, 3], [11, 4]];

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



//showing the current element to the user (the canva)
let canvasTemplate = (playGame) => html`  <canvas id="canvas" width="800" height="700" style="position:absolute; top:3%; left:22%;" ></canvas> <button @click=${playGame} id="begin" width = "200" height="40" style="position:absolute; top:46%; left:36%">Click To Start</button>`;

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

    drawGrid();
}




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
//TODO: adding the pause button in its place
export function playGame() {
    gameCycle = setInterval(drawScene, 200);
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
//TODO view where the check method have to be hronologically

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

function doNextMove(direction, snakeCoordinations) {

    let headCoordinations = snakeCoordinations[snakeCoordinations.length - 1].slice(0);


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

    //check if you have eaten an apple
    if (matrix[headCoordinations[0]][headCoordinations[1]] != 'A') {
        snakeCoordinations.shift();
    }
    else if (matrix[headCoordinations[0]][headCoordinations[1]] = 'A') {
        currentAppleCoordinations = [];
    }


    let isCrossing = snakeCoordinations.find(x => x[0] == headCoordinations[0] && x[1] == headCoordinations[1]);
    if (isCrossing != undefined) {
        clearInterval(gameCycle);
    }

    snakeCoordinations.push([headCoordinations[0], headCoordinations[1]]);
}


//methods for the logic of the apple

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

    if (freePlaces.length == 0) {
        //TODO winning the game
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


//clering methods for the canva and the matrix

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



//logic for adding the apple in the matrix and not deleting it in the method of clearing the matrix
//scoring counter for the amount of apples eaten
//making the snake longer when she eats an apple
//logic for the case when the snake bites itself
//
//TODO: changing the speed of the snake after becoming longer
//pause option during playing