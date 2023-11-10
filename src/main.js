import "./styles.css"
import chessGame, { loadGame, renderBoard, animatePiece } from "./chess/board.js"

const whiteSide = true

loadGame(chessGame, whiteSide)

let history = 0

document.addEventListener('keydown', (e) => {
    const current = chessGame.history.length
    const prevHistory = history
    const speed = 25
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
        renderBoard(chessGame, whiteSide)
        return
    }
    if(history === current - 1 && prevHistory !== (current + 1)) {
        renderBoard(chessGame.history[0], whiteSide, true)
        console.log(history)
        return
    }

    showHistory(chessGame, current, history, prevHistory, speed)
    
})


function showHistory(chessGame, current, history, prevHistory, speed) {
    // Left Arrow
    if(history > prevHistory) {
        const game = chessGame.history[current - history]
        const begin = history === 1 ? chessGame.lastMove[0] : chessGame.history[current - history + 1].lastMove[0]
        const end = history === 1 ? chessGame.lastMove[1] : chessGame.history[current - history + 1].lastMove[1]
        animatePiece(end, begin, speed)
            .then(() => {
                renderBoard(game, whiteSide, true)
            })
            .catch((e) => {
                renderBoard(game, whiteSide, true)
                console.log("caught error", {e})
            })
    }
    // Right Arrow
    if(history < prevHistory) {
        const game = history === 0 ? chessGame : chessGame.history[current - history]
        const begin = game.lastMove[0]
        const end = game.lastMove[1]
        animatePiece(begin, end, speed)
            .then(() => {
                renderBoard(game, whiteSide, history !== 0)
            })
            .catch((e) => {
                renderBoard(game, whiteSide, history !== 0)
                console.log("caught error", {e})
            })
    }
}