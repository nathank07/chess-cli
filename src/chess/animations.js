import { renderBoard, playSound } from "./board.js"
import { convertLocationToNotation } from "./notation.js"

// Default speed (going through history)
const speed = 1
// Speed when a new move is made
const moveSpeed = 0.8

export function animateHistory(chessGame, prevHistory) {
    const current = chessGame.history.length
    const history = chessGame.timeline
    if(history === prevHistory) {
        return
    }
    const game = history !== 0 ? chessGame.history[current - history] : chessGame
    // If the move isn't one move ahead/behind
    if(Math.abs(prevHistory - history) !== 1) {
        if(history === 0) {
            renderBoard(chessGame)
        }
        if(history === current) {
            renderBoard(chessGame.history[0])
        }
        return
    }

    let begin
    let end

    // Left Arrow
    if(history > prevHistory) {
        begin = history === 1 ? chessGame.lastMove[0] : chessGame.history[current - history + 1].lastMove[0]
        end = history === 1 ? chessGame.lastMove[1] : chessGame.history[current - history + 1].lastMove[1]
    }
    // Right Arrow
    if(history < prevHistory) {
        end = game.lastMove[0]
        begin = game.lastMove[1]
    }
    const animating = chessGame.div.querySelector('.animating')
    // Don't render animation if another board was already rendered
    if(!animating) {
        if(history < prevHistory) {
            playSound(game)
        }
        animatePiece(end, begin, game.div.firstChild)
            .then(() => {
                if(chessGame.timeline) {
                    renderBoard(chessGame.history[chessGame.history.length - chessGame.timeline])
                } else {
                    renderBoard(chessGame)
                }
            })
            .catch((e) => {
                console.log("caught error", e)
            })
    } else {
        const sound = history < prevHistory
        if(chessGame.timeline) {
            renderBoard(chessGame.history[chessGame.history.length - chessGame.timeline])
            if(sound) {
                playSound(chessGame.history[chessGame.history.length - chessGame.timeline])
            }
        } else {
            renderBoard(chessGame)
            if(sound) {
                playSound(chessGame)
            }
        }
    }
}

export default function animateMove(game, fromX, fromY, toX, toY, sound = false, promotion = false, clicked = false) {
    if(game.board[fromX][fromY] && game.board[fromX][fromY].move(toX, toY, promotion ? promotion : undefined, clicked)) {
        game.timeline = 0
        renderBoard(game.history[game.history.length - 1])
        const start = convertLocationToNotation(fromX, fromY)
        const end = convertLocationToNotation(toX, toY)
        if(sound) {
            playSound(game)
        }
        animatePiece(start, end, game.div.firstChild, moveSpeed)
            .then(() => {
                renderBoard(game)
            })
        return true
    }
    return false
}

export function animatePiece(fromNotation, toNotation, boardDiv, speedMultiplier = speed) {
    const initialDiv = boardDiv.querySelector(`[notation=${fromNotation}]`)
    const destination = boardDiv.querySelector(`[notation=${toNotation}]`)
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

    const child = initialDiv.lastChild
    let error;
    
    if(child) {
        boardDiv.querySelectorAll(".highlighted").forEach(square => {
            square.classList.remove("highlighted")
        });
        boardDiv.querySelector(`[notation=${fromNotation}`).classList.add("highlighted")
        boardDiv.querySelector(`[notation=${toNotation}`).classList.add("highlighted")
        child.animate([
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${toXloc - fromXloc}px, ${toYloc - fromYloc}px)` }
        ], {
            duration: duration,
            iterations: 1
        })
        child.classList.add('animating')
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
