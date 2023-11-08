import { Piece, outOfBounds } from "./piece.js"

export default function Knight( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "knight",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            let moves = [];
            const knightMoves = [
                [2, 1],
                [1, 2],
                [-2, 1],
                [-1, 2],
                [2, -1],
                [1, -2],
                [-2, -1],
                [-1, -2]
            ]
            knightMoves.forEach(move => {
                const x = xPos + move[0]
                const y = yPos + move[1]
                if(!outOfBounds(x, y) && (game.board[x][y] === null || piece.canCapture(game.board[x][y]))) {
                    moves.push([x, y])
                }
            });
            
            return moves
        }
    })
    return piece;
}