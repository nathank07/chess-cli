import "./styles.css"
import "./chess/cburnett/move.svg"
import chessGame, { convertNotationtoLocation, loadGame, renderBoard, undoMove } from "./chess/board.js"
import { setPromisetoNull, animateHistory } from "./chess/animations.js"

let whiteSide = true
let history = 0

loadGame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", whiteSide)

document.addEventListener('keydown', (e) => {
    const current = chessGame.history.length
    const prevHistory = history
    if(e.code === "ArrowLeft") {
        history < current - 1 ? history++ : history = current - 1
    }
    if(e.code === "ArrowRight") {
        history > 0 ? history-- : history = 0
    }
    if(e.code === "ArrowUp") {
        history = current - 1
    }
    if(e.code === "ArrowDown") {
        history = 0
    } 
    if(history !== prevHistory){
        const loc = convertNotationtoLocation(chessGame.lastMove[1])
        const lastPieceMoved = chessGame.board[loc[0]][loc[1]].name
        chessGame.drawnArrows = []
        if(lastPieceMoved === "pawn" && (loc[0] === 0 || loc[0] === 7)) {
            undoMove(chessGame)
            document.querySelector('.promotion').remove()
        } 
        else {
            animateHistory(chessGame, current, prevHistory)
        }
    }
    if(e.code === "KeyF") {
        whiteSide = !whiteSide
        renderBoard(chessGame)
    }
    if(e.code === "KeyZ") {
        undoMove(chessGame, history)
        history = 0
    }
})

export default function isWhite() {
    return whiteSide
}

export function resetHistory() {
    if(history !== 0) {
        renderBoard(chessGame.history[chessGame.history.length - 1])
        setPromisetoNull()
        history = 0
    }
}
export { history }
