import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, fetchMove } from "./chess/board.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'

const chessGame = createGame()
const board = chessGame.div
document.querySelector("#root").appendChild(board)

const moves = ['d2d4', 'h7h6', 'd4d5', 'h6h5', 'd5d6', 'h5h4', 'd6c7', 'h4h3', 'c7b8q', 'h3g2', 'g1f3', 'g2f1n']

moves.forEach((move, i) => {
    setTimeout(() => {
        fetchMove(chessGame, move)
    }, 500 * i)
});

const chessGame2 = createGame("r1bqkb1r/ppnppppp/8/1BpnP3/8/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 1 6")
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
    }
    if(e.code === "KeyX") {
        undoMove(chessGame2)
    }
})


