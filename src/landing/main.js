import './landing.css'
import { importGame } from '../chess/board.js'

const game = importGame(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', ['e2e4', 'd7d5', 'd2d4']])

const nextAnchor = document.querySelector('a#next');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 30) {
        nextAnchor.classList.add('hidden');
    } else {
        nextAnchor.classList.remove('hidden');
    }
});

document.querySelector('#board-container-parent').appendChild(game.div)
