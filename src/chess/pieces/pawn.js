import blackQueen from '../cburnett/bQ.svg'
import whiteQueen from '../cburnett/wQ.svg'
import blackRook from '../cburnett/bR.svg' 
import whiteRook from '../cburnett/wR.svg' 
import blackBishop from '../cburnett/bB.svg' 
import whiteBishop from '../cburnett/wB.svg' 
import blackKnight from '../cburnett/bN.svg' 
import whiteKnight from '../cburnett/wN.svg' 

import createPiece, { Piece, inCheck, outOfBounds } from "./piece.js"
import { renderBoard } from '../board.js'

export default function Pawn( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "pawn",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const direction = isWhite ? 1 : -1
            const starting = isWhite ? xPos === 1 : xPos === 6
            let moves = []
            for(let i = -1; i <= 1; i++) {
                const x = xPos + direction
                const y = yPos + i

                if(outOfBounds(x, y)) { continue }

                if(i !== 0 && piece.canCapture(game.board[x][y])) {
                    if(game.board[x][y].name === "passant") {
                        moves.push([x, y, () => {
                            game.board[x - direction][y] = null
                        }])
                        continue
                    }
                    if(x === 0 || x === 7) {
                        moves.push([x, y, async () => {
                            //promotion logic
                            const piece = await promoteMenu(game, isWhite)
                            createPiece(piece, isWhite, x, y, game)
                            if(inCheck(game)) {
                                game.lastMoveSound = "check"
                            }
                            renderBoard(game)
                        }])
                        continue
                    }
                    moves.push([x, y])
                } 

                else if (i === 0 && game.board[xPos + direction][y] == null) {
                    if(starting && game.board[xPos + (direction * 2)][y] == null) { 
                        // add en passant object for this move
                        moves.push([xPos + (direction * 2), y, () => {
                            createPiece("passant", isWhite, xPos + direction, y, game);
                        }]) 
                    }
                    if(x === 0 || x === 7) {
                        moves.push([x, y, async () => {
                            //promotion logic
                            const piece = await promoteMenu(game, isWhite)
                            createPiece(piece, isWhite, x, y, game)
                            if(inCheck(game)) {
                                game.lastMoveSound = "check"
                            }
                            renderBoard(game)
                        }])
                        continue
                    }
                    moves.push([x, y])
                }

            }
            return moves
        },
    })
    return piece;
}

async function promoteMenu(game, isWhite) {
    return new Promise(resolve => {
        console.log(game)
        const boardContainer = game.div
        const backdrop = document.createElement("div")
        const pieces = [
            [isWhite ? whiteQueen : blackQueen, "queen"],
            [isWhite ? whiteKnight : blackKnight, "knight"],
            [isWhite ? whiteBishop : blackBishop, "bishop"],
            [isWhite ? whiteRook : blackRook, "rook"]
        ]
        backdrop.classList.add("promotion")

        pieces.forEach(piece => {
            const divParent = document.createElement("div")
            const img = document.createElement("img")
            img.src = piece[0]
            divParent.appendChild(img)
            divParent.setAttribute("value", piece[1])
            divParent.addEventListener("click", () => {
                const choice = divParent.getAttribute("value")
                resolve(choice)
                boardContainer.removeChild(backdrop)
            })
            backdrop.appendChild(divParent)
        });
        boardContainer.appendChild(backdrop)
    })
}