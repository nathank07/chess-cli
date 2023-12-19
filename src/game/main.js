import "./game.css"
import "../chess/cburnett/move.svg"
import ChessTimer from "../chess/timer.js"
import newGame, { createTokenAndJoin, existingGame } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, flipBoard } from '../chess/modify.js'

if(document.body.dataset.id) {
    const game = await existingGame(document.body.dataset.id, document.querySelector('#root'))
    const blackTimer = document.createElement('div')
    blackTimer.innerHTML = "5:00.0"
    const whiteTimer = document.createElement('div')
    whiteTimer.innerHTML = "5:00.0"
    const black = ChessTimer(300, 1, (t) => updateTimer(t, blackTimer), alertFunction)
    const white = ChessTimer(300, 1, (t) => updateTimer(t, whiteTimer), alertFunction, black)
    game.timer = white
    white.start()
    addControls(game)
    createTokenAndJoin(game)
        .then(res => {
            updateToast(res)
        })
        .catch(error => {
            updateToast(error)
        })
    const playersDiv = document.createElement('div')
    playersDiv.id = "players"
    playersDiv.appendChild(whiteTimer)
    playersDiv.appendChild(blackTimer)
    playersDiv.appendChild(game.whiteUserSpan)
    playersDiv.appendChild(game.blackUserSpan)
    game.div.parentNode.prepend(playersDiv)
    console.log("hi", whiteTimer, blackTimer)
}


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

function updateTimer(time, div) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    const milliseconds = Math.floor((time - minutes * 60000 - seconds * 1000) / 100)
    div.innerText = `${minutes}:${seconds}.${milliseconds}`
}

function alertFunction() {
    console.log("Timer finished")
}

export function updateToast(text) {
    const toast = document.querySelector('#toast')
    if(!toast) {
        return
    } 
    if(text.result) {
        if(text.result === "Stalemate") {
            toast.innerHTML = `Game ended in Stalemate due to ${text.reason}.`
        } else {
            toast.innerHTML = `${text.result} has won due to ${text.reason}`
        }
    } else {
        toast.innerHTML = text
    }   
}





