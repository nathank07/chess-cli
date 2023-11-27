import { convertNotationtoLocation, convertLocationToNotation } from "./notation"
import animateMove from "./animations"
import { playSound } from "./board"

export default function makeDraggable(square, svg, renderBoard){
    svg.addEventListener('mousedown', (e) => {
        e.preventDefault()

        const alreadyHighlighted = svg.parentNode.classList.contains("highlighted")
        let board = square.game.div.firstChild
        if(e.buttons === 1) {
            // render board and set svg (since svg changes when you render board) so it resets users selection if there is one
            board = renderBoard(square.game)
            svg = board.querySelector(`[notation=${convertLocationToNotation(square.xPos, square.yPos)}`).lastChild
        }

        const moves = square.moves()
        const legalSquares = movesToDivs(moves, board)
        const allSquares = board.querySelectorAll('.square')
        const initialSquare = svg.parentNode
        
        
        let size;
        let outsideInitialSquare = false;
        
        if(e.buttons === 1) {
            const canvas = svg.parentNode.parentNode.parentNode.querySelector("#svg-canvas")
            canvas.innerHTML = ""
            square.game.drawnArrows = []
            // Set size here everytime in case user resizes window
            size = svg.parentNode.parentNode.offsetWidth / 8
            // We declare the event listeners here to the document 
            // because pointer-events: none unbinds the svg event listeners
            document.addEventListener('mousedown', mouseDown) 
            document.addEventListener('mousemove', mouseMove)
            document.addEventListener('mouseup', mouseUp)
            allSquares.forEach(div => {
                if(legalSquares.includes(div)) {
                    if(div.querySelector('img')) {
                        div.classList.add("possiblepiece")
                    } else {
                        div.classList.add("possible")
                    }
                    div.addEventListener('click', click)
                } else {
                    div.addEventListener('click', clear)
                }
            });
            moveToCursor(e, svg, size)
        }
        // Clears user selection if they click off a valid move
        function clear(event) {
            event.preventDefault()
            document.removeEventListener('mousedown', mouseDown) 
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('click', clear)
            allSquares.forEach(div => {
                div.removeEventListener('click', click)
                div.removeEventListener('click', clear)
            });
            renderBoard(square.game)
        }
        function mouseDown(event) {
            // This is done so users can cancel their moves with any button
            event.preventDefault()
            if(event.buttons !== 1) { 
                document.removeEventListener('mouseup', mouseUp)
                document.removeEventListener('mousemove', mouseMove)
                document.removeEventListener('click', clear)
                document.removeEventListener('mousedown', mouseDown)
                renderBoard(square.game)
            }
        }
        function mouseMove(event) {
            if(board.querySelector("#board .square.select") !== initialSquare) {
                outsideInitialSquare = true
            }
            moveToCursor(event, svg, size)
        }
        function mouseUp(event) {
            event.preventDefault()
            document.removeEventListener('mousedown', mouseDown)
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
            svg.style.pointerEvents = "auto"
            const move = selectSquare(board)
            if(event.buttons === 0 && square.move(move[0], move[1], false, true)) {
                playSound(square.game)
                renderBoard(square.game)
            }
            if(!outsideInitialSquare) {
                svg.style.position = null
                svg.style.zIndex = "1"
                if(alreadyHighlighted) {
                    clear(e)
                }
            } else {
                clear(e)
            }
        }
        function click(event) {
            event.preventDefault()
            const move = convertNotationtoLocation(event.target.getAttribute("notation") || event.target.parentNode.getAttribute("notation"))
            const originalPos = [square.xPos, square.yPos]
            // Remove indicators as they're no longer relevant
            board.querySelectorAll('.possible').forEach(square => {
                square.classList.remove('possible')
            });
            board.querySelectorAll('.possiblepiece').forEach(square => {
                square.classList.remove('possiblepiece')
            });
            animateMove(square.game, originalPos[0], originalPos[1], move[0], move[1], false, false, true)
            playSound(square.game)
            document.removeEventListener('mousedown', mouseDown) 
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('click', clear)
            allSquares.forEach(div => {
                div.removeEventListener('click', click)
                div.removeEventListener('click', clear)
            });
        }
    })
} 

function moveToCursor(event, svg, size) {
    const x = event.clientX - (size / 2)
    const y = event.clientY - (size / 2)

    // Using fixed style here instead of transform because 
    // transform did not work for some users
    svg.style.pointerEvents = "none"
    svg.style.zIndex = "2"
    svg.style.position = "fixed"
    svg.style.width = `${size}px`
    svg.style.height = `${size}px`
    svg.style.left = `${x}px`
    svg.style.top = `${y}px`
    svg.parentNode.classList.add('highlighted')
}

function selectSquare(board) {
    const notation = board.querySelector(".square.select")
    return notation ? convertNotationtoLocation(notation.getAttribute("notation")) : false
}

function movesToDivs(moves, board) {
    let divs = []
    moves.forEach(move => {
        const square = convertLocationToNotation(move[0], move[1])
        const squareDiv = board.querySelector(`[notation=${square}`)
        divs.push(squareDiv)
    });
    return divs
}