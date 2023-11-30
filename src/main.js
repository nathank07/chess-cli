import "./styles.css"
import "./chess/cburnett/move.svg"
import { createGame, importGame, fetchMove } from "./chess/board.js"
import { createWSGame, createWebSocket, requestGame, getGame, handleMoves } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, changePlayerSide, flipBoard } from './chess/modify.js'

let chessGame
createWebSocket(188)
        .then((res) => {
            chessGame = res
            document.querySelector("#root").appendChild(res.div)
            addControls(chessGame)
        })

//createWebSocket(274)
//.then((res) => {
//    document.querySelector("#root").appendChild(res.div)
//})



function addControls(chessGame){
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
    })
    document.querySelector('#current').addEventListener('click', () => viewCurrentGame(chessGame))
    document.querySelector('#start').addEventListener('click', () => viewStartHistory(chessGame))
    document.querySelector('#back').addEventListener('click', () => viewBackHistory(chessGame))
    document.querySelector('#forwards').addEventListener('click', () => viewForwardHistory(chessGame))
    document.querySelector('#flip').addEventListener('click', () => flipBoard(chessGame))
    document.querySelector('#takeback').addEventListener('click', () => undoMove(chessGame))
}

export function updateToast(text) {
    document.querySelector('#toast').innerHTML = text
}





