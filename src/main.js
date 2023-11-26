import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, importGame, fetchMove } from "./chess/board.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'

const game = [false, "e2e4", "g8f6", "e4e5", "f6d5", "b1c3", "d5c3", "b2c3", "d7d5", "f2f4", "c7c5", "g1f3", "b8c6", "d2d4", "c5d4", "c3d4", "c8f5", "c2c3", "e7e6", "f1d3", "f5d3", "d1d3", "d8d7", "e1g1", "a7a6", "f3g5", "h7h6", "g5h3", "g7g6", "g2g4", "h6h5", "h3g5", "h5g4", "c1e3", "f8e7", "d3e2", "h8h4", "e3f2", "h4h5", "e2g4", "c6a5", "a1b1", "b7b5", "a2a4", "a5c4", "a4b5", "a6b5", "g5f3", "d7c6", "b1b3", "e8d7", "f1b1", "a8a5", "g4g2", "c6a6", "g2f1", "d7c6", "f2e1", "a5a1", "f3d2", "a1b1", "b3b1", "a6a2", "f1d3", "g6g5", "f4f5", "g5g4", "f5f6", "e7a3", "h2h4", "g4h3", "d2c4", "a2g2"];

const chessGame = createGame()
changePlayerSide(chessGame, true)
const board = chessGame.div
document.querySelector("#root").appendChild(board)

let len = 0
let timebetween = 100

game.splice(1).forEach((move) => {
    len++
   setTimeout(() => {
       fetchMove(chessGame, move)
   }, timebetween * len)
});

let chessGame2
setTimeout(() => {
    chessGame2 = importGame(chessGame.export)
    const board2 = chessGame2.div
    document.querySelector("#root").appendChild(board2)

}, timebetween * len)

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


