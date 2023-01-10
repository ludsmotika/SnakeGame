import { html } from 'https://unpkg.com/lit-html?module';

let main = document.getElementById('main');


let homePageTemplate = () => html`<div id="startingPage">
    <p class="mainText">Snake Game</p>
    
    <a style="position:absolute; top: 260px; left: 270px;" id="start" href="/game">Start Game</a>
    <a style="position:absolute; top: 390px; left: 270px;" id="scores">Best Scores</a>
    <a style="position:absolute; top: 520px; left: 270px;" id="help" href="/help">Help</a>
    
    <img src="./resources/snakeStartingPage.png" alt="snake image" width="600"
    style="position:absolute; top:150px; left: 800px">
</div>`;


export async function showHomePage(ctx) {
    //Array.from(main.children).map(x => x.remove());
    await ctx.render(homePageTemplate());
}


let helpPageTemplate = () => html`<div id="helpPage">
<a id='backButton' href="/" style="position:absolute; top: 80px; left: 100px;">Return to home</a>
<p class="mainText">Instructions</p>
<h2 class="secondaryText">Gameplay: The player controls a long, thin snake-like creature that crawls along a
    plane, collecting food, avoiding collisions with its own
    tail and the edges of the playing field. Every time the snake eats a piece of food, it becomes longer,
    which gradually complicates the game.</h2>
<img src="./resources/keyboardArrows.png" alt="keyboard image"
    style="position:absolute; top:350px; left: 850px" width="350">
<img src="./resources/apple.png" alt="apple image" width="300"
    style="position:absolute; top:90px; left: 1100px">
</div>`;

export async function showHelpPage(ctx) {
    // Array.from(main.children).map(x => x.remove());
    await ctx.render(helpPageTemplate());
}


//TODO: finish the scores page logic

let scoresPageTemplate = () => html``;

export async function showScoresPage() {

}