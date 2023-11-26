import { renderBoard } from "./board"
import createPiece, { cloneBoard } from "./pieces/piece"
import { animatePiece } from "./animations"
import { convertNotationtoLocation } from "./notation"
import { animateHistory } from "./animations"

export function viewBackHistory(game) {
    const length = game.history.length
    const prevHistory = game.timeline
    if(game.timeline < length) {
        game.timeline++
    }
    if(game.timeline === 1) {
        const loc = convertNotationtoLocation(game.lastMove[1])
        const lastPieceMoved = game.board[loc[0]][loc[1]].name
        if(lastPieceMoved === "pawn" && (loc[0] === 0 || loc[0] === 7)) {
            undoMove(game)
            game.div.querySelector('.promotion').remove()
        } else {
            animateHistory(game, prevHistory)
        }
        return
    }
    animateHistory(game, prevHistory)
}

export function viewForwardHistory(game) {
    const prevHistory = game.timeline
    if(game.timeline > 0) {
        game.timeline--
    }
    animateHistory(game, prevHistory)
}

export function viewStartHistory(game) {
    const prevHistory = game.timeline
    const length = game.history.length
    game.timeline = length
    animateHistory(game, prevHistory)
}

export function viewCurrentGame(game) {
    const prevHistory = game.timeline
    game.timeline = 0
    animateHistory(game, prevHistory)
}

export function flipBoard(game) {
    game.showingWhiteSide = !game.showingWhiteSide
    game.timeline ? renderBoard(game.history[game.history.length - 1]) : renderBoard(game)
}

export function undoMove(game, render = true) {
    if(game.history.length < 1) {
        return false;
    }

    const animation = game.lastMove 
    renderBoard(game)
       
    const oldBoard = cloneBoard(game.history[game.history.length - 1].board)
    game.board = [...Array(8)].map(e => Array(8).fill(null));
    // We clone the board and create pieces because squares are binded to specific boards
    oldBoard.forEach((row, x) => {
        row.forEach((square, y) => {
            if(square) {
                createPiece(oldBoard[x][y].name, oldBoard[x][y].isWhite, x, y, game)
            }
        });
    });
    const oldGame = game.history[game.history.length - 1]
    const properties = ['whiteState', 'blackState', 'lastMove', 'fiftyMoveRule',
    'lastMoveSound', 'whitesMove', 'drawnArrows', 'userHighlights', 'showingWhiteSide']
    properties.forEach(prop => {
        game[prop] = oldGame[prop]
    });
    game.timeline = 0
    if(game.history.length > 1) {
        game.history.pop()
    }    
    if(animation) {
        animatePiece(animation[1], animation[0], game.div.firstChild)
            .then(() => {
                renderBoard(game)
            })
    } else {
        if(render) {
            renderBoard(game)
        }
    }
    return game
}

export function changePlayerSide(game, spectator) {
    game.playerIsWhite = !game.playerIsWhite
    if(spectator) {
        game.playerIsWhite = null
    }
    renderBoard(game)
}

