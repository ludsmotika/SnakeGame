
let canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const gridCol = 20;
const gridRow = 20;
const colTickness = width / gridCol;
const rowTickness = height / gridRow;

// starting the game by filling the background of the canvas and drawing the matrix

export function startGame(){

    ctx.beginPath();
    ctx.fillStyle = '#8CCD4A';
    ctx.fillRect(0, 0, width, height);
    ctx.closePath();
    
    ctx.stroke();
    
    drawingGrid(ctx);

}



//drawing things

function drawingGrid(ctx) {
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < gridCol; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colTickness, 0);
        ctx.lineTo(i * colTickness, 700);
        ctx.closePath();
        ctx.stroke();
    }
    for (let k = 1; k < gridRow; k++) {
        ctx.beginPath();
        ctx.moveTo(0, k * rowTickness);
        ctx.lineTo(800, k * rowTickness);
        ctx.closePath();
        ctx.stroke();
    }

}

function snakeDraw(matrix) {

}

/** different methods for being able to draw the snake */


//user input

/** add event listener for button cliking  */