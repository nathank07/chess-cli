import "./game.css"
import "../header/header.css"
import "../footer/footer.css"
import "../chess/cburnett/move.svg"
import { importGame } from '../chess/board.js'
import { createTokenAndJoin, existingGame } from "./websockets.js"
import { viewStartHistory, viewCurrentGame, undoMove, flipBoard } from '../chess/modify.js'
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
        console.log(gameData.game)
        game.id = gameData.id
        game.whiteUserSpan.textContent = gameData.game.whitePlayer
        game.blackUserSpan.textContent = gameData.game.blackPlayer
        game.result = {
            result: gameData.game.winner,
            reason: gameData.game.reason.toLowerCase()
        }
        game.timeSpent = gameData.game.timed_uci.split(" ")
        game.timeControl = gameData.game.time_control
        if(gameData.game.winner.toLowerCase() === "white") {
            game.result.result = gameData.game.whitePlayer 
        }
        if(gameData.game.winner.toLowerCase() === "black") {
            game.result.result = gameData.game.blackPlayer 
        }
        gameContainer.innerHTML = "";
        gameContainer.appendChild(game.div)
    }
    addControls(game)
    const whiteInfo = document.querySelector('#whiteInfo')
    const blackInfo = document.querySelector('#blackInfo')
    whiteInfo.prepend(game.whiteUserSpan)
    blackInfo.prepend(game.blackUserSpan)
    fillHistory(game, document.querySelector('ol'))
    if(!gameData.live) {
        startButton(game)
    }
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
        //     undoMove(chessGame, true, true)
        // }
    })
    document.querySelector('#end').addEventListener('click', () => endButton(chessGame))
    document.querySelector('#start').addEventListener('click', () => startButton(chessGame))
    document.querySelector('#back').addEventListener('click', () => backButton(chessGame))
    document.querySelector('#forward').addEventListener('click', () => forwardButton(chessGame))
    document.querySelector('#flip').addEventListener('click', () => flipBoard(chessGame))
    
    const chessBoard = document.querySelector('#game')
    if(chessBoard) {
        chessBoard.addEventListener('wheel', (e) => {
            e.preventDefault()
            if(e.deltaY > 0) {
                forwardButton(chessGame)
            } else {
                backButton(chessGame)
            }
        })
    }
    // document.querySelector('#takeback').addEventListener('click', () => undoMove(chessGame))
}

function endButton(game) {
    viewCurrentGame(game)
    const nodes = document.querySelectorAll('ol > li > span')
    nodes.forEach(span => {
        span.classList.remove('active')
    })
    if(nodes[nodes.length - 1].innerHTML !== "") { 
        nodes[nodes.length - 1].classList.add('active')
    } else {
        nodes[nodes.length - 2].classList.add('active')
    }
    const oldPos = window.scrollY
    document.querySelector('ol').scrollTo({
        top: document.querySelector('ol').scrollHeight,
        behavior: 'smooth'
    });
    window.scrollTo(0, oldPos)
    changeClock(game, game.history.length)
}

function startButton(game) {
    viewStartHistory(game)
    document.querySelectorAll('ol > li > span').forEach(span => {
        span.classList.remove('active')
    })
    const oldPos = window.scrollY
    document.querySelector('ol').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo(0, oldPos)
    changeClock(game, 0)
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
    const leadingZero = seconds < 10 ? "0" : ""
    div.innerText = `${minutes}:${leadingZero}${seconds}.${milliseconds}`
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
    history.forEach((gameState, i) => {
        const prevBoard = game.history[i].board
        const prevMove = lastMoveToNotation(gameState, prevBoard)
        fillHistoryCell(game, ol, prevMove, i)
    });
    const oldPos = window.scrollY
    ol.scrollTo({
        top: ol.scrollHeight,
    });
    window.scrollTo(0, oldPos)
}

function fillHistoryCell(game, ol, notation, i) {
    let li = ol.querySelectorAll('li')
    li = li.length !== 0 ? li[li.length - 1] : null
    if(!li || li.querySelector('span:last-child').innerText !== "") {
        li = document.createElement('li')
        const numSpan = document.createElement('span')
        numSpan.addEventListener('click', () => goToHistory(game, i))
        const moveSpan = document.createElement('span')
        moveSpan.addEventListener('click', () => goToHistory(game, i))
        moveSpan.setAttribute('history-index', i)
        const number = Math.floor(i / 2) + 1
        numSpan.innerText = `${number}.`
        moveSpan.innerText = notation
        const emptySpan = document.createElement('span')
        li.appendChild(numSpan)
        li.appendChild(moveSpan)
        li.appendChild(emptySpan)
        ol.appendChild(li)
    } else {
        const moveSpan2 = li.querySelector('span:last-child')
        moveSpan2.addEventListener('click', () => goToHistory(game, i))
        moveSpan2.setAttribute('history-index', i)
        moveSpan2.innerText = notation
    }
    goToHistory(game, i, false)
}

export function newHistoryCell(game, ol) {
    const prevBoard = game.history[game.history.length - 1].board
    const prevMove = lastMoveToNotation(game, prevBoard)
    fillHistoryCell(game, ol, prevMove, game.history.length - 1)
}

function goToHistory(game, historyIndex, sound = true) {
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
    animateHistory(game, prevHistory, sound)
    document.querySelectorAll('ol > li > span').forEach(span => {
        span.classList.remove('active')
    })
    const activeSpan = document.querySelector(`[history-index="${historyIndex}"]`)
    const oldPos = window.scrollY
    if(activeSpan) { 
        activeSpan.classList.add('active')
        scrollIntoView(document.querySelector('ol'), activeSpan.parentElement)
    }
    window.scrollTo(0, oldPos)
    changeClock(game, historyIndex + 1)
}

function changeClock(game, index) {
    if(game.timeSpent) {
        const startingSideWhite = game.history[0].whitesMove
        const time = game.timeControl.split('+')[0] * 1000;
        const increment = game.timeControl.split('+')[1] * 1000
        const whiteClock = document.querySelector('#whiteTimer')
        const blackClock = document.querySelector('#blackTimer')
        let whiteTime = time
        let blackTime = time
        for(let i = 0; i < index; i++) {
            if(startingSideWhite && i % 2 === 0) {
                whiteTime -= game.timeSpent[i]
                whiteTime += increment
            } else {
                blackTime -= game.timeSpent[i]
                blackTime += increment
            }
        }
        updateTimer(whiteTime, whiteClock)
        updateTimer(blackTime, blackClock)
    }
}

// scrollIntoView with window.scrollTo does not behave as expected on Chrome
function scrollIntoView(ol, li) {
    const liLocation = li.offsetTop
    ol.scrollTo({
        top: liLocation - ol.offsetTop,
        behavior: 'smooth'
    });
}

export function updateToast(text) {
    const toast = document.querySelector('#toast')
    if(!toast) {
        return
    } 
    if(text.result) {
        if(text.result === "Stalemate") {
            toast.innerHTML = `Game ended in stalemate due to ${text.reason.toLowerCase()}.`
        } else {
            toast.innerHTML = `${text.result} has won due to ${text.reason.toLowerCase()}`
        }
    } else {
        toast.innerHTML = text
    }   
}





