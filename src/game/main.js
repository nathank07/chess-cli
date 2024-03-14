import "./game.css"
import "../header/header.css"
import "../footer/footer.css"
import "../chess/cburnett/move.svg"
import { importGame, renderBoard } from '../chess/board.js'
import { createTokenAndJoin, existingGame } from "./websockets.js"
import { viewStartHistory, viewBackHistory, viewForwardHistory, viewCurrentGame, undoMove, flipBoard } from '../chess/modify.js'
import { lastMoveToNotation } from "../chess/notation.js"
import { animateHistory } from "../chess/animations.js"

if(document.body.dataset.id) {
    const gameContainer = document.querySelector('#game')
    const urlParams = new URLSearchParams(window.location.search);
    const isBlack = urlParams.get('black')
    window.history.replaceState({}, document.title, "/game/" + document.body.dataset.id);
    const res = await fetch(`/api/game/${document.body.dataset.id}`)
    const gameData = await res.json()
    let game
    if(gameData.live) {
        game = await existingGame(document.body.dataset.id, gameContainer, createUpdate)
        createTokenAndJoin(game, isBlack)
            .then(res => {
                updateToast(res)
            })
            .catch(error => {
                updateToast(error)
            })
    } else {
        game = importGame([gameData.game.fen, [...gameData.game.uci.split(' ')]])
        game.id = gameData.id
        game.whiteUserSpan.textContent = gameData.game.whitePlayer
        game.blackUserSpan.textContent = gameData.game.blackPlayer
        gameContainer.innerHTML = "";
        gameContainer.appendChild(game.div)
    }
    addControls(game)
    const whiteInfo = document.querySelector('#whiteInfo')
    const blackInfo = document.querySelector('#blackInfo')
    whiteInfo.prepend(game.whiteUserSpan)
    blackInfo.prepend(game.blackUserSpan)
    fillHistory(game, document.querySelector('ol'))
    console.log(game)
}


function addControls(chessGame){
    document.addEventListener('keydown', (e) => {
        if(e.code === "ArrowLeft") {
            backButton(chessGame)
        }
        if(e.code === "ArrowRight") {
            forwardButton(chessGame)
        }
        if(e.code === "ArrowUp") {
            e.preventDefault()
            startButton(chessGame)
        }
        if(e.code === "ArrowDown") {
            e.preventDefault()
            endButton(chessGame)
        } 
        if(e.code === "KeyF") {
            flipBoard(chessGame)
        }
        // if(e.code === "KeyZ") {
        //     undoMove(chessGame)
        // }
    })
    document.querySelector('#end').addEventListener('click', () => endButton(chessGame))
    document.querySelector('#start').addEventListener('click', () => startButton(chessGame))
    document.querySelector('#back').addEventListener('click', () => backButton(chessGame))
    document.querySelector('#forward').addEventListener('click', () => forwardButton(chessGame))
    document.querySelector('#flip').addEventListener('click', () => flipBoard(chessGame))
    // document.querySelector('#takeback').addEventListener('click', () => undoMove(chessGame))
}

function endButton(game) {
    viewCurrentGame(game)
    const nodes = document.querySelectorAll('ol > li > span')
    if(nodes[nodes.length - 1].innerHTML !== "") { 
        nodes[nodes.length - 1].classList.add('active')
    } else {
        nodes[nodes.length - 2].classList.add('active')
    }
    document.querySelector('ol').scrollTo({
        top: document.querySelector('ol').scrollHeight,
        behavior: 'smooth'
    });
}

function startButton(game) {
    viewStartHistory(game)
    document.querySelectorAll('ol > li > span').forEach(span => {
        span.classList.remove('active')
    })
    document.querySelector('ol').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function backButton(game) {
    const currentHistory = game.history.length - game.timeline - 1
    goToHistory(game, currentHistory - 1)
}

function forwardButton(game) {
    const currentHistory = game.history.length - game.timeline - 1
    goToHistory(game, currentHistory + 1)
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

function fillHistory(game, ol) {
    ol.innerHTML = ""
    const history = game.history.slice(1)
    history.push(game)
    const moveArr = ["", ""]
    history.forEach((gameState, i) => {
        const prevBoard = game.history[i].board
        if(!moveArr[0]) {
            moveArr[0] = lastMoveToNotation(gameState, prevBoard)
        } else {
            moveArr[1] = lastMoveToNotation(gameState, prevBoard)
            const li = document.createElement('li')
            const numSpan = document.createElement('span')
            const moveSpan = document.createElement('span')
            moveSpan.addEventListener('click', (e) => goToHistory(game, i - 1))
            moveSpan.setAttribute('history-index', i - 1)
            const moveSpan2 = document.createElement('span')
            moveSpan2.addEventListener('click', (e) => goToHistory(game, i))
            moveSpan2.setAttribute('history-index', i)
            const number = Math.floor(i / 2) + 1
            numSpan.innerText = `${number}.`
            moveSpan.innerText = moveArr[0]
            moveSpan2.innerText = moveArr[1]
            li.appendChild(numSpan)
            li.appendChild(moveSpan)
            li.appendChild(moveSpan2)
            ol.appendChild(li)
            moveArr[0] = ""
            moveArr[1] = ""
        }
    });
    if(moveArr[0]) {
        const li = document.createElement('li')
        const numSpan = document.createElement('span')
        const moveSpan = document.createElement('span')
        moveSpan.addEventListener('click', (e) => goToHistory(game, history.length - 1))
        moveSpan.setAttribute('history-index', history.length - 1)
        moveSpan.classList.add('active')
        const emptySpan = document.createElement('span')
        const number = Math.floor(history.length / 2) + 1
        numSpan.innerText = `${number}.`
        moveSpan.innerText = moveArr[0]
        li.appendChild(numSpan)
        li.appendChild(moveSpan)
        li.appendChild(emptySpan)
        ol.appendChild(li)
    } else {
        const nodes = document.querySelectorAll('ol > li > span')
        nodes[nodes.length - 1].classList.add('active')
    }
}

function goToHistory(game, historyIndex) {
    const prevHistory = game.timeline
    game.timeline = game.history.length - (historyIndex + 1)
    if(game.timeline <= 0) {
        game.timeline = 0
        historyIndex = game.history.length - 1
    }
    if(game.timeline >= game.history.length) {
        game.timeline = game.history.length
        historyIndex -= 1
    }
    animateHistory(game, prevHistory)
    document.querySelectorAll('ol > li > span').forEach(span => {
        span.classList.remove('active')
    })
    const activeSpan = document.querySelector(`[history-index="${historyIndex}"]`)
    if(activeSpan) { 
        activeSpan.classList.add('active')
        activeSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
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





