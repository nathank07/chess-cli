import "./styles.css"
import "./chess/cburnett/move.svg"
import { convertNotationtoLocation, createGame, renderBoard, undoMove, changePlayerSide, flipBoard } from "./chess/board.js"
import { animateHistory } from "./chess/animations.js"

let whiteSide = true
//let history = 0

const chessGame = createGame()
const board = chessGame.div
document.querySelector("#root").appendChild(board)

const chessGame2 = createGame("r1bqkb1r/ppnppppp/8/1BpnP3/8/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 1 6")
const board2 = chessGame2.div
document.querySelector("#root").appendChild(board2)

changePlayerSide(chessGame2)
flipBoard(chessGame2)

document.addEventListener('keydown', (e) => {
    if(e.code === "ArrowLeft") {
        viewBackHistory(chessGame)
        viewBackHistory(chessGame2)
    }
    if(e.code === "ArrowRight") {
        viewForwardHistory(chessGame)
        viewForwardHistory(chessGame2)
    }
    if(e.code === "ArrowUp") {
        viewStartHistory(chessGame)
        viewStartHistory(chessGame2)
    }
    if(e.code === "ArrowDown") {
        viewCurrentGame(chessGame)
        viewCurrentGame(chessGame2)
    } 
    if(e.code === "KeyF") {
        flipBoard(chessGame)
        flipBoard(chessGame2)
    }
    if(e.code === "KeyZ") {
        undoMove(chessGame)
        undoMove(chessGame2)
    }
})

function viewBackHistory(game) {
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

function viewForwardHistory(game) {
    const prevHistory = game.timeline
    if(game.timeline > 0) {
        game.timeline--
    }
    animateHistory(game, prevHistory)
}

function viewStartHistory(game) {
    const prevHistory = game.timeline
    const length = game.history.length
    game.timeline = length
    animateHistory(game, prevHistory)
}

function viewCurrentGame(game) {
    const prevHistory = game.timeline
    game.timeline = 0
    animateHistory(game, prevHistory)
}

export default function isWhite() {
    return whiteSide
}

export function resetTimeline(game) {
    if(game.timeline !== 0) {
        renderBoard(game.history[game.history.length - 1])
        game.timeline = 0
    }
}
//export { history }
