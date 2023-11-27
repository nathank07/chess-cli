import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, importGame, fetchMove } from "./chess/board.js"
import { createWSGame, createWebSocket, requestGame, getGame, handleMoves } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'



let chessGame
createWSGame(false)
    .then(res => {
        return createWebSocket(res)
        .then((res) => {
            chessGame = res
            document.querySelector("#root").appendChild(res.div)
        })
    })

setTimeout(()=> {
    return createWebSocket(chessGame.id)
    .then((res2) => {
        document.querySelector("#root").appendChild(res2.div)
    })
}, 500)





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


