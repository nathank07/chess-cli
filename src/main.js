import "./styles.css"
import chessGame, { loadGame, renderBoard } from "./chess/board.js"

const whiteSide = true

loadGame(chessGame, whiteSide)

let history = 0

document.addEventListener('keydown', (e) => {
    const length = chessGame.history.length
    if(e.code === "ArrowLeft") {
        if(history < length - 1) {
            history++
            renderBoard(chessGame.history[length - history], whiteSide, true)
        }
    }
    if(e.code === "ArrowRight") {
        history--
        if(history >= 1) {
            renderBoard(chessGame.history[length - history], whiteSide, true)
        } else {
            history = 0
            renderBoard(chessGame, whiteSide)
        }
    }
    if(e.code === "ArrowUp") {
        history = length - 1
        renderBoard(chessGame.history[length - history], whiteSide, true)
    }
    if(e.code === "ArrowDown") {
        history = 0
        renderBoard(chessGame, whiteSide)
    }
})
