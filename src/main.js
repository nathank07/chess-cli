import "./styles.css"
import chessGame, { loadGame, renderBoard, animatePiece } from "./chess/board.js"

const whiteSide = true

loadGame(chessGame, whiteSide)

let history = 0

document.addEventListener('keydown', (e) => {
    const current = chessGame.history.length
    const prevHistory = history
    const speed = 10
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
        showHistory(chessGame, current, prevHistory, speed)
    }  
})


let animating = false
let promise = null

function showHistory(chessGame, current, prevHistory, speed) {
    let game
    let begin
    let end

    // If the move isn't one move ahead/behind
    if(Math.abs(prevHistory - history) !== 1) {
        if(history === 0) {
            renderBoard(chessGame, whiteSide)
            promise = null
        }
        if(history === current - 1) {
            renderBoard(chessGame.history[0], whiteSide, true)
            promise = null
        }
        return
    }
    // Left Arrow
    if(history > prevHistory) {
        game = chessGame.history[current - history]
        begin = history === 1 ? chessGame.lastMove[0] : chessGame.history[current - history + 1].lastMove[0]
        end = history === 1 ? chessGame.lastMove[1] : chessGame.history[current - history + 1].lastMove[1]
    }
    // Right Arrow
    if(history < prevHistory) {
        game = history === 0 ? chessGame : chessGame.history[current - history]
        end = game.lastMove[0]
        begin = game.lastMove[1]
    }

    // Don't render animation if another board was already rendered
    if(promise === null && !animating) {
        animating = true
        promise = [end, begin, speed, history]
        const runningPromise = [end, begin, speed, history]
        animatePiece(promise[0], promise[1], promise[2], promise[3])
            .then(() => {
                if(promise !== null && runningPromise.every((value, index) => value === promise[index])) {
                    renderBoard(game, whiteSide, history !== 0)
                }
            })
            .catch((e) => {
                console.log("caught error", e)
            })
            .finally(() => {
                animating = false
                promise = null
            })
    } else {
        renderBoard(game, whiteSide, history !== 0)
        promise = null
    }
}