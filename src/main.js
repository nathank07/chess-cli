import "./styles.css"
import chessGame, { loadGame, renderBoard } from "./chess/board.js"
import { setPromisetoNull, animateHistory } from "./chess/animations.js"

let whiteSide = false
let history = 0

loadGame(chessGame)

document.addEventListener('keydown', (e) => {
    const current = chessGame.history.length
    const prevHistory = history
    const speed = 1
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
        animateHistory(chessGame, current, prevHistory, speed)
    }
    if(e.code === "KeyF") {
        whiteSide = !whiteSide
        renderBoard(chessGame)
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
