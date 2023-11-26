export function createSVGCanvas(boardDiv) {
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.id = "svg-canvas"
    arrowSvg.setAttribute('height', boardDiv.offsetHeight);
    arrowSvg.setAttribute('width', boardDiv.offsetWidth);
    arrowSvg.setAttribute('viewBox', `0 0 ${boardDiv.offsetWidth} ${boardDiv.offsetHeight}`);
    boardDiv.parentNode.appendChild(arrowSvg);
    return arrowSvg;
}

export function markHoveredPieces(boardDiv) {
    const boardSquares = boardDiv.querySelectorAll("#board .square")
    boardSquares.forEach(square => {
        square.addEventListener("mouseover", () => {
            square.classList.add("select")
        })
        square.addEventListener("mouseout", () => {
            square.classList.remove("select")
        })
    });
}

// Modified version of https://github.com/frogcat/canvas-arrow
export function drawArrow(fromX, fromY, toX, toY, canvas, skinny = false) {
    const size = canvas.viewBox.baseVal.width;
    const width = (size / 80) * (skinny ? 0.75 : 1);
    const arrowHeadWidth = (size / 32) * (skinny ? 0.75 : 1);
    const arrowHeadHeight = (size / -21.5) * (skinny ? 0.75 : 1);
    const offset = size / 21;
    let dx = toX - fromX;
    let dy = toY - fromY;
    let len = Math.sqrt((dx * dx + dy * dy));

    const sin = dy / len;
    const cos = dx / len;

    fromX += offset * cos;
    fromY += offset * sin;
    toX -= skinny ? cos * 11 : cos
    toY -= skinny ? sin * 11 : cos
    dx = toX - fromX;
    dy = toY - fromY;
    len = Math.sqrt((dx * dx + dy * dy))

    const controlPoints = [0, width, arrowHeadHeight, width, arrowHeadHeight, arrowHeadWidth];
    const a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const x = controlPoints[i];
      const y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
      const x = controlPoints[i - 2];
      const y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    var points = '';
    for (let i = 0; i < a.length; i += 2) {
      const x = a[i] * cos - a[i + 1] * sin + fromX;
      const y = a[i] * sin + a[i + 1] * cos + fromY;
      points += `${x},${y} `;
    }
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'orange');
    polygon.setAttribute('opacity', '0.65');
    canvas.appendChild(polygon);
}

function drawUserHighlights(game) {
    game.div.querySelectorAll('.userHighlight').forEach(div => {
        div.classList.remove("userHighlight")
    });
    game.userHighlights.forEach(div => {
        const square = game.div.querySelector(`[notation=${div}`)
        square.classList.add("userHighlight")
    });
}

function drawArrows(game, canvas) {
    game.drawnArrows.forEach(arrow => {
        const initialSquare = game.div.querySelector(`[notation=${arrow[0]}`)
        const destinationSquare = game.div.querySelector(`[notation=${arrow[1]}`)
        const width = initialSquare.offsetWidth
        const fromCenterX = initialSquare.offsetLeft + (width / 2)
        const fromCenterY = initialSquare.offsetTop + (width / 2)
        const toCenterX = destinationSquare.offsetLeft + (width / 2)
        const toCenterY = destinationSquare.offsetTop + (width / 2)
        drawArrow(fromCenterX, fromCenterY, toCenterX, toCenterY, canvas)
    });
}

export function drawUserMarkings(game, canvas) {
    drawUserHighlights(game)
    drawArrows(game, canvas)
}

export function addUserMarkings(squareDiv, game, canvas) {
    let fromCenterX
    let fromCenterY
    let toCenterX
    let toCenterY
    squareDiv.addEventListener('mousedown', e => {
        const squareDivNot = squareDiv.getAttribute('notation')
        let board
        let width
        if(e.buttons == 2) {
            const boardContainer = game.div
            // This was the best way I could think of to work around board rendering and having a piece selected
            boardContainer.querySelector('.square:not(.possible):not(.possiblepiece)').click()
            squareDiv = boardContainer.querySelector(`[notation=${squareDivNot}]`)
            canvas = boardContainer.querySelector("#svg-canvas")

            board = squareDiv.parentNode
            width = squareDiv.offsetWidth

            if(canvas.viewBox.baseVal.width !== board.offsetWidth) {
                canvas.setAttribute('viewBox', `0 0 ${board.offsetWidth} ${board.offsetWidth}`);
            }

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
                    const position = initialSquare.getAttribute("notation")
                    const index = game.userHighlights.indexOf(position)
                    index === -1 ? game.userHighlights.push(position) : game.userHighlights.splice(index, 1)
                    drawUserHighlights(game)
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

export function annotateBoard(boardDiv, whiteSide) {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const leftNotation = whiteSide ? "a" : "h"
    const bottomNotation = whiteSide ? 1 : 8
    let darkSquare = !whiteSide
    for(let i = 1; i <= 8; i++) {
        const leftDiv = boardDiv.querySelector(`[notation=${leftNotation + i}]`)
        const notation = document.createElement('span')
        notation.classList.add('left-notation')
        notation.classList.add(darkSquare ? 'dark' : 'light')
        notation.innerHTML = i
        leftDiv.prepend(notation)
        darkSquare = !darkSquare
    }
    for(const letter in alphabet) {
        const bottomDiv = boardDiv.querySelector(`[notation=${alphabet[letter] + bottomNotation}]`)
        const notation = document.createElement('span')
        notation.classList.add('bottom-notation')
        notation.classList.add(darkSquare ? 'dark' : 'light')
        notation.innerHTML = alphabet[letter]
        bottomDiv.prepend(notation)
        darkSquare = !darkSquare
    }
    
}