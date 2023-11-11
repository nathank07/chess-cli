import { history, resetHistory } from "../main.js"
import { renderBoard, convertLocationToNotation } from "./board.js"

// Default speed (going through history)
const speed = 1
// Speed when a new move is made
const moveSpeed = 0.7
let animating = false
let promise = null

export function setPromisetoNull() {
    promise = null
}

export function animateHistory(chessGame, current, prevHistory, customSpeed = speed) {
    let game
    let begin
    let end

    // If the move isn't one move ahead/behind
    if(Math.abs(prevHistory - history) !== 1) {
        if(history === 0) {
            renderBoard(chessGame)
            promise = null
        }
        if(history === current - 1) {
            renderBoard(chessGame.history[0], true)
            promise = null
        }
        return
    }
    // Left Arrow
    if(history > prevHistory) {
        game = chessGame.history[current - history]
        begin = history === 1 ? chessGame.lastMove[0] : chessGame.history[current - history + 1].lastMove[0]
        end = history === 1 ? chessGame.lastMove[1] : chessGame.history[current - history + 1].lastMove[1]
    }
    // Right Arrow
    if(history < prevHistory) {
        game = history === 0 ? chessGame : chessGame.history[current - history]
        end = game.lastMove[0]
        begin = game.lastMove[1]
    }

    // Don't render animation if another board was already rendered
    if(promise === null && !animating) {
        animating = true
        promise = [end, begin, customSpeed, history]
        const runningPromise = [end, begin, speed, history]
        animatePiece(promise[0], promise[1], promise[2], promise[3])
            .then(() => {
                if(promise !== null && runningPromise.every((value, index) => value === promise[index])) {
                    renderBoard(game, history !== 0)
                }
            })
            .catch((e) => {
                console.log("caught error", e)
            })
            .finally(() => {
                animating = false
                promise = null
            })
    } else {
        renderBoard(game, history !== 0)
        promise = null
    }
}

export default function animateMove(game, fromX, fromY, toX, toY) {
    if(game.board[fromX][fromY] && game.board[fromX][fromY].move(toX, toY)) {
        // If user is behind then show the current game
        resetHistory()
        
        const start = convertLocationToNotation(fromX, fromY)
        const end = convertLocationToNotation(toX, toY)
        promise = null 
        animating = true
        animatePiece(start, end, moveSpeed).then(() => {
            renderBoard(game)
        })
        .finally(() => {
            promise = null
            animating = false
        })
        return
    } else {
        return false
    }
}

function animatePiece(fromNotation, toNotation, speedMultiplier = speed) {
    const initialDiv = document.querySelector(`[notation=${fromNotation}]`)
    const destination = document.querySelector(`[notation=${toNotation}]`)
    const size = initialDiv.offsetWidth / 2
    const fromXloc = initialDiv.getBoundingClientRect().left + size
    const fromYloc = initialDiv.getBoundingClientRect().top + size
    const toXloc = destination.getBoundingClientRect().left + size
    const toYloc = destination.getBoundingClientRect().top + size

    // 1 speedMultipler = 1 square per second 
    let duration = ((Math.sqrt(Math.pow(((fromXloc - toXloc) / size), 2) + Math.pow(((fromYloc - toYloc) / size), 2))) * (1 / speedMultiplier)) * 250

    // Threshold in squares where you want to stop moving by distance
    const minSpeed = 1 

    // Caps duration set minSpeed
    duration = duration <= ((minSpeed * 100) / speedMultiplier) ? duration : (minSpeed * 100) / speedMultiplier

    const child = initialDiv.firstChild
    let error;
    
    if(child) {
        document.querySelectorAll(".highlighted").forEach(square => {
            square.classList.remove("highlighted")
        });
        document.querySelector(`[notation=${fromNotation}`).classList.add("highlighted")
        document.querySelector(`[notation=${toNotation}`).classList.add("highlighted")
        child.animate([
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${toXloc - fromXloc}px, ${toYloc - fromYloc}px)` }
        ], {
            duration: duration,
            iterations: 1
        })
    } else {
        error = new Error(`Nothing to animate from ${fromNotation}`)
    }

    return new Promise((resolve, reject) => {
        if(error) {
            reject(error)
        }
        // Send promise 10ms early to prevent ghosting
        setTimeout(() => {
            resolve()
        }, duration - 10)
    })
}
