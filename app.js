import { showScoresPage, showHelpPage, showHomePage } from "./views.js";
import { showGame } from "./game.js";
import { default as page } from './node_modules/page/page.mjs';
import { render } from 'https://unpkg.com/lit-html?module';

let mainElement = document.getElementById('main');

page(decorateContext);
page('/', showHomePage)
page('/game', showGame);
page('/scores', showScoresPage);
page('/help', showHelpPage);

page.start();
page.redirect('/');

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, mainElement);
    next();
}






