import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, fetchMove } from "./chess/board.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'

const chessGame = createGame()
const board = chessGame.div
document.querySelector("#root").appendChild(board)

//const moves = ['e5g6']//, 'f4f3']
//
//moves.forEach((move, i) => {
//   setTimeout(() => {
//       fetchMove(chessGame2, move)
//   }, 500 * i)
//});

const chessGame2 = createGame("rnbqkb1r/pppppppp/8/4n3/5N2/8/PPPPPPPP/RNBQKB1R b KQkq - 99 50")
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


