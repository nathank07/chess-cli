import './landing.css'
import { drawUserMarkings } from '../chess/marking.js'
import { createGame, animateGame, fetchMove } from '../chess/board.js'
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, flipBoard } from '../chess/modify.js'


loopAnimation(document.querySelector('#next-section > #board-container-parent'), 500)
analyzeEnglundOpening(document.querySelectorAll('section #board-container-parent')[1])

const nextAnchor = document.querySelector('a#next');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 30) {
        nextAnchor.classList.add('hidden');
    } else {
        nextAnchor.classList.remove('hidden');
    }
});

function loopAnimation(div, speed) {
    div.innerHTML = ''
    const animatedMoves = ['d2d4', 'g8f6', 'c2c4', 'e7e6', 'b1c3', 'f8b4', 'g1f3', 'e8g8', 'c1g5', 'c7c5',
    'e2e3', 'c5d4', 'd1d4', 'b8c6', 'd4d3', 'h7h6', 'g5h4', 'd7d5', 'a1d1', 'g7g5', 'h4g3', 'f6e4', 'f3d2',
    'e4c5', 'd3c2', 'd5d4', 'd2f3', 'e6e5', 'f3e5', 'd4c3', 'd1d8', 'c3b2', 'e1e2', 'f8d8', 'c2b2', 'c5a4',
    'b2c2', 'a4c3', 'e2f3', 'd8d4', 'h2h3', 'h6h5', 'g3h2', 'g5g4', 'f3g3', 'd4d2', 'c2b3', 'c3e4', 'g3h4',
    'b4e7', 'h4h5', 'g8g7', 'h2f4', 'c8f5', 'f4h6', 'g7h7', 'b3b7', 'd2f2', 'h6g5', 'a8h8', 'e5f7', 'f5g6',
    'h5g4', 'c6e5', 'g4h4', 'h7g8', 'f7h8', 'e7g5']
    const game = createGame(false, true)
    animateGame(game, animatedMoves, false, speed)
        .then(() => {
            loopAnimation(div, speed)
        });
    div.appendChild(game.div)
}

function analyzeEnglundOpening(div) {
    const game = createGame(false, true)
    div.append(game.div)
    flipBoard(game)
    moveAndMark(game, 'd2d4')
    moveAndMark(game, 'e7e5')
    moveAndMark(game, 'd4e5')
    moveAndMark(game, 'b8c6')
    moveAndMark(game, 'g1f3')
    moveAndMark(game, 'd8e7', [['e7', 'e5'], ['c6', 'e5']], ['e5'])
    moveAndMark(game, 'c1f4', [['f4', 'e5'], ['f3', 'e5'], ['e7', 'e5'], ['c6', 'e5']], ['e5'])
    moveAndMark(game, 'e7b4', [['b4', 'e1'], ['b4', 'f4'], ['b4', 'b2']], ['f4', 'b2'])
    moveAndMark(game, 'f4d2', [['b4', 'b2'], ['d2', 'b4']], ['b4', 'b2'])
    moveAndMark(game, 'b4b2', [['b2', 'a1']], ['a1'])
    moveAndMark(game, 'd2c3', [['c3', 'a1'], ['b1', 'c3']], ['b2'])
    moveAndMark(game, 'f8b4', [['b4', 'e1']], ['e1'])
    moveAndMark(game, 'd1d2', [['c3', 'a1']])
    moveAndMark(game, 'b4c3', [['c3', 'e1']], ['e1'])
    moveAndMark(game, 'd2c3', [['b2', 'c1']])
    moveAndMark(game, 'b2c1', [['c1', 'e1']], ['d1', 'd2'])
    addControls(game)
}

function moveAndMark(game, UCI, arrows, highlightedSquares) {
    fetchMove(game, UCI, false, true)
    if(history.length > 1) {
        game.history[game.history.length - 1].drawnArrows = game.drawnArrows
        game.history[game.history.length - 1].userHighlights = game.userHighlights
    }
    game.drawnArrows = []
    game.userHighlights = []
    if(arrows) {
        arrows.forEach(arrow => {
            game.drawnArrows.push([arrow[0], arrow[1]])
        });
    }
    if(highlightedSquares) {
        highlightedSquares.forEach(square => {
            game.userHighlights.push(square)
        });
    }
    drawUserMarkings(game, game.div.parentNode.querySelector('svg'))
}

function addControls(game) {
    document.addEventListener('keydown', (e) => {
        if(e.code === "ArrowLeft") {
            viewBackHistory(game)
        }
        if(e.code === "ArrowRight") {
            viewForwardHistory(game)
        }
        if(e.code === "ArrowUp") {
            viewStartHistory(game)
        }
        if(e.code === "ArrowDown") {
            viewCurrentGame(game)
        } 
        if(e.code === "KeyF") {
            flipBoard(game)
        }
    })
    document.querySelector('#end').addEventListener('click', () => viewCurrentGame(game))
    document.querySelector('#start').addEventListener('click', () => viewStartHistory(game))
    document.querySelector('#back').addEventListener('click', () => viewBackHistory(game))
    document.querySelector('#forward').addEventListener('click', () => viewForwardHistory(game))
    document.querySelector('#flip').addEventListener('click', () => flipBoard(game))
}