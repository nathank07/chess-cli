import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, importGame, fetchMove } from "./chess/board.js"
import { createWSGame, createWebSocket, requestGame, getGame, handleMoves } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'

let chessGame
createWebSocket(199)
        .then((res) => {
            chessGame = res
            document.querySelector("#root").appendChild(res.div)
        })

//createWebSocket(274)
//.then((res) => {
//    document.querySelector("#root").appendChild(res.div)
//})




//changePlayerSide(chessGame)
//flipBoard(chessGame)

document.addEventListener('keydown', (e) => {
    if(e.code === "ArrowLeft") {
        viewBackHistory(chessGame)
    }
    if(e.code === "ArrowRight") {
        viewForwardHistory(chessGame)
    }
    if(e.code === "ArrowUp") {
        viewStartHistory(chessGame)
    }
    if(e.code === "ArrowDown") {
        viewCurrentGame(chessGame)
    } 
    if(e.code === "KeyF") {
        flipBoard(chessGame)
    }
    if(e.code === "KeyZ") {
        undoMove(chessGame)
    }
    if(e.code === "KeyX") {
        //undoMove(chessGame2)
    }
})


