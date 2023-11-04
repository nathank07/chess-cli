import { Piece, outOfBounds } from "./piece.js"

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
                    moves.push([x, y])
                }

            }
            return moves
        },
    })
    return piece;
}