import "./styles.css"
import chessGame, { loadGame, renderBoard } from "./chess/board.js"
import { setPromisetoNull, animateHistory } from "./chess/animations.js"

const white = false
let history = 0

loadGame(chessGame, white)

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
})


export function resetHistory() {
    if(history !== 0) {
        renderBoard(chessGame.history[chessGame.history.length - 1])
        setPromisetoNull()
        history = 0
    }
}

export default white
export { history }
