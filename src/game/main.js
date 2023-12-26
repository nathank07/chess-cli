import "./game.css"
import "../chess/cburnett/move.svg"
import { createTokenAndJoin, existingGame } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, flipBoard } from '../chess/modify.js'

if(document.body.dataset.id) {
    const game = await existingGame(document.body.dataset.id, document.querySelector('#root'), createUpdate)
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
    playersDiv.appendChild(game.whiteUserSpan)
    playersDiv.appendChild(game.blackUserSpan)
    game.div.parentNode.prepend(playersDiv)
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

export function createTimerDiv(game, isWhite, div) {
    const timer = isWhite ? game.whiteClock : game.blackClock
    updateTimer(timer.timeLeft, div)
    timer.updateFunction = (time) => updateTimer(time, div)
    return timer
}

function createUpdate(game) {
    createTimerDiv(game, true, document.querySelector('#whiteTimer'))
    createTimerDiv(game, false, document.querySelector('#blackTimer'))
}

function updateTimer(time, div) {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    const milliseconds = Math.floor((time - minutes * 60000 - seconds * 1000) / 100)
    div.innerText = `${minutes}:${seconds}.${milliseconds}`
}

function flagTimer(timer, color) {
    const div = document.querySelector(`#${color}Timer`)
    timer.pause()
    updateTimer(0, div)
    // TODO: Add flag animation
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





