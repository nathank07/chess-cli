import createPiece, { cloneBoard, cloneGame, makeDraggable } from "./pieces/piece.js"
import isWhite from "../main.js"
import animateMove, { animatePiece } from "./animations.js"
import place from "./sounds/Move.ogg"
import capture from "./sounds/Capture.ogg"
import check from "./sounds/Check.wav"

let chessGame = {
    board: [...Array(8)].map(e => Array(8).fill(null)),
    whitesMove: true,
    whiteState: {
        shortCastle: false,
        longCastle: false,
    },
    blackState: {
        shortCastle: false,
        longCastle: false,
    },
    history: [],
    lastMove: null,
    lastMoveSound: null,
    drawnArrows: [],
}

const sounds = {
    "place": place,
    "capture": capture,
    "check": check
}

export function convertLocationToNotation(xPos, yPos) {
    const file = {
        0: "h",
        1: "g",
        2: "f",
        3: "e",
        4: "d",
        5: "c",
        6: "b",
        7: "a"
    }
    return `${file[yPos]}${xPos + 1}`
}

export function convertNotationtoLocation(notation) {
    const file = {
        "h": 0,
        "g": 1,
        "f": 2,
        "e": 3,
        "d": 4,
        "c": 5,
        "b": 6,
        "a": 7
    }
    return [Number(notation[1]) - 1, file[notation[0]]]
}

function FENtoBoard(FENstring) {
    
    const pieces = {
        "p": "pawn",
        "q": "queen",
        "b": "bishop",
        "n": "knight",
        "r": "rook",
        "k": "king"
    }

    FENstring = FENstring.split(" ")

    const board = [...FENstring[0].split("/")].reverse()

    board.forEach((row, i) => {
        row = row.replace(/\d+/g, (number) => {
            return "#".repeat(Number(number))
        })
        row.split("").reverse().forEach((char, j) => {
            const isWhite = char === char.toUpperCase()
            if(char !== "#") {
                createPiece(pieces[char.toLowerCase()], isWhite, i, j, chessGame)
            }
        });
    });
    
    chessGame.whitesMove = FENstring[1] === "w"

    FENstring[2].split("").forEach(char => {
        if(char === "k") {
            chessGame.blackState.shortCastle = true
        }
        if(char === "q") {
            chessGame.blackState.longCastle = true
        }
        if(char === "K") {
            chessGame.whiteState.shortCastle = true
        }
        if(char === "Q") {
            chessGame.whiteState.longCastle = true
        }
    });

    if(FENstring[3] !== "-") {
        const loc = convertNotationtoLocation(FENstring[3])
        createPiece("passant", !chessGame.whitesMove, loc[0], loc[1], chessGame)
    }

    return chessGame
}

function markHoveredPieces() {
    const boardSquares = document.querySelectorAll("#board .square")
    boardSquares.forEach(square => {
        square.addEventListener("mouseover", () => {
            square.classList.add("select")
        })
        square.addEventListener("mouseout", () => {
            square.classList.remove("select")
        })
    });
}

export function undoMove(game, history) {
    let animation;
    if(game.lastMove && history !== undefined && history === 0) {
        animation = game.lastMove
    }
    const oldBoard = cloneBoard(game.history[game.history.length - 1].board)
    chessGame.board = [...Array(8)].map(e => Array(8).fill(null));
    // We clone the board and create pieces because squares are binded to specific boards
    oldBoard.forEach((row, x) => {
        row.forEach((square, y) => {
            if(square) {
                createPiece(oldBoard[x][y].name, oldBoard[x][y].isWhite, x, y, game)
            }
        });
    });
    const oldGame = game.history[game.history.length - 1]
    game.whiteState = oldGame.whiteState
    game.blackState = oldGame.blackState
    game.lastMove = oldGame.lastMove
    game.lastMoveSound = oldGame.lastMoveSound
    game.whitesMove = oldGame.whitesMove
    game.drawnArrows = oldGame.drawnArrows
    if(game.history.length > 1) {
        game.history.pop()
    }
    if(animation) {
        animatePiece(animation[1], animation[0])
            .then(() => {
                renderBoard(game)
            })
    } else {
        renderBoard(game)
    }
    return game
}

export function squareDivs(moves) {
    let divs = []
    moves.forEach(move => {
        const square = convertLocationToNotation(move[0], move[1])
        const squareDiv = document.querySelector(`[notation=${square}`)
        divs.push(squareDiv)
    });
    return divs
}

export function playSound(game) {
    if(game.lastMoveSound) {
        const sound = new Audio(sounds[game.lastMoveSound])
        sound.play()
    }
}

function createSVGCanvas(boardDiv) {
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.id = "svg-canvas"
    arrowSvg.setAttribute('height', boardDiv.offsetHeight);
    arrowSvg.setAttribute('width', boardDiv.offsetWidth);
    arrowSvg.setAttribute('viewBox', `0 0 ${boardDiv.offsetWidth} ${boardDiv.offsetHeight}`);
    boardDiv.parentNode.appendChild(arrowSvg);
    return arrowSvg;
}

// Modified version of https://github.com/frogcat/canvas-arrow

function drawArrow(fromX, fromY, toX, toY, canvas = document.querySelector("#svg-canvas"), skinny = false) {
    const size = canvas.viewBox.baseVal.width;
    const width = (size / 80) * (skinny ? 0.75 : 1);
    const arrowHeadWidth = (size / 32) * (skinny ? 0.75 : 1);
    const arrowHeadHeight = (size / -21.5) * (skinny ? 0.75 : 1);
    const controlPoints = [0, width, arrowHeadHeight, width, arrowHeadHeight, arrowHeadWidth];
    var dx = toX - fromX;
    var dy = toY - fromY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var sin = dy / len;
    var cos = dx / len;
    var a = [];
    a.push(0, 0);
    for (var i = 0; i < controlPoints.length; i += 2) {
      var x = controlPoints[i];
      var y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (var i = controlPoints.length; i > 0; i -= 2) {
      var x = controlPoints[i - 2];
      var y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    var points = '';
    for (var i = 0; i < a.length; i += 2) {
      var x = a[i] * cos - a[i + 1] * sin + fromX;
      var y = a[i] * sin + a[i + 1] * cos + fromY;
      points += `${x},${y} `;
    }
    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'orange');
    polyline.setAttribute('opacity', '0.8');
    canvas.appendChild(polyline);
}

export function drawArrows(game, canvas) {
    game.drawnArrows.forEach(arrow => {
        const initialSquare = document.querySelector(`[notation=${arrow[0]}`)
        const destinationSquare = document.querySelector(`[notation=${arrow[1]}`)
        const width = initialSquare.offsetWidth
        const fromCenterX = initialSquare.offsetLeft + (width / 2)
        const fromCenterY = initialSquare.offsetTop + (width / 2)
        const toCenterX = destinationSquare.offsetLeft + (width / 2)
        const toCenterY = destinationSquare.offsetTop + (width / 2)
        drawArrow(fromCenterX, fromCenterY, toCenterX, toCenterY, canvas)
    });
}

function addUserMarkings(squareDiv, game, canvas) {
    let fromCenterX
    let fromCenterY
    let toCenterX
    let toCenterY
    squareDiv.addEventListener('mousedown', e => {
        let board
        let width
        if(e.button == 2) {
            board = squareDiv.parentNode
            width = squareDiv.offsetWidth
            fromCenterX = squareDiv.offsetLeft + (width / 2)
            fromCenterY = squareDiv.offsetTop + (width / 2)
            toCenterX = fromCenterX
            toCenterY = fromCenterY
            document.addEventListener('mousemove', drawPreviewArrow)
            document.addEventListener('mouseup', finalizeInput)
        } else {
            if(squareDiv.parentNode) {
                squareDiv.parentNode.querySelectorAll(".square").forEach(div => {
                    div.classList.remove("userHighlight")
                });
                game.drawnArrows = []
                canvas.innerHTML = ""
                document.removeEventListener('mousemove', drawPreviewArrow)
                document.removeEventListener('mouseup', finalizeInput)
            }
        }

        function drawPreviewArrow(event) {
            canvas.innerHTML = ""
            const hoveredSquare = board.querySelector('.square.select')
            if(hoveredSquare) {
                toCenterX = hoveredSquare.offsetLeft + (width / 2) || fromCenterX
                toCenterY = hoveredSquare.offsetTop + (width / 2) || fromCenterY
                drawArrow(fromCenterX, fromCenterY, toCenterX, toCenterY, canvas, true)
            }
            drawArrows(game, canvas)
        }
        function finalizeInput(event) {
            document.removeEventListener('mousemove', drawPreviewArrow)
            document.removeEventListener('mouseup', finalizeInput)
            if(squareDiv.parentNode && event.button === 2) {
                const initialSquare = squareDiv
                const destinationSquare = squareDiv.parentNode.querySelector('.square.select')
                if(destinationSquare && initialSquare === destinationSquare) {
                    const classes = squareDiv.classList
                    classes.contains("userHighlight") ? classes.remove("userHighlight") : classes.add("userHighlight")
                } else {
                    if(destinationSquare) {
                        const fromDiv = initialSquare.getAttribute("notation")
                        const toDiv = destinationSquare.getAttribute("notation")
                        const position = [fromDiv, toDiv]
                        let index = false
                        game.drawnArrows.forEach((arrow, i) => {
                            if(arrow.every((value, i) => value === position[i])) {
                                index = i
                            }
                        });
                        index || index === 0 ? game.drawnArrows.splice(index, 1) : game.drawnArrows.push(position)
                        canvas.innerHTML = ""
                        drawArrows(game, canvas)
                    }
                }
            }
        }
    })
}

export function renderBoard(game, history = false) {
    const whiteSide = isWhite()
    const boardDiv = document.querySelector("#board")
    boardDiv.innerHTML = ""
    if(boardDiv.parentNode.querySelector('#svg-canvas')) {
        boardDiv.parentNode.querySelector('#svg-canvas').remove()
    }
    const board = whiteSide ? [...game.board].reverse() : game.board
    const increment = whiteSide ? -1 : 1
    const highlighted = game.lastMove !== null
    let darkSquare = true
    let x = whiteSide ? 7 : 0
    const canvas = createSVGCanvas(boardDiv)
    board.forEach(row => {
        let y = whiteSide ? 7 : 0
        const newRow = whiteSide ? [...row].reverse() : row
        newRow.forEach(square => {
            const div = document.createElement('div')
            const notation = convertLocationToNotation(x, y)
            div.setAttribute("notation", notation)
            div.classList.add("square")
            addUserMarkings(div, game, canvas)
            darkSquare = !darkSquare
            if(darkSquare) { div.classList.add('darkSquare') }
            const pieceSvg = square ? square.svg : false
            if(pieceSvg) {
                const svg = document.createElement('img')
                svg.src = pieceSvg
                if(!history) {
                    if(square.isWhite === game.whitesMove) {
                        makeDraggable(square, svg, renderBoard)
                    }
                }
                div.appendChild(svg)
            }
            boardDiv.appendChild(div)
            y += increment
        });
        darkSquare = !darkSquare
        x += increment
    });
    if(highlighted) {
        document.querySelector(`[notation=${game.lastMove[0]}`).classList.add("highlighted")
        document.querySelector(`[notation=${game.lastMove[1]}`).classList.add("highlighted")
    }
    drawArrows(game, canvas)
    markHoveredPieces()
    return boardDiv
}

function animateGame(game, moves, timeBetweenMoves) {
    let totalMoves = 0
    moves.map(move => {
        totalMoves++
        setTimeout(() => {
            animateMove(game, move[0], move[1], move[2], move[3])
        }, timeBetweenMoves * totalMoves)
    })
}

export function loadGame(game) {
    chessGame = FENtoBoard(game)
    renderBoard(chessGame)
    chessGame.history.push(cloneGame(chessGame))
}

export default chessGame