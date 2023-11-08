import { Piece, outOfBounds } from "./piece.js"

export default function Bishop( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "bishop",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const directions = [
                [1, 1],
                [1, -1], 
                [-1, 1], 
                [-1, -1]  
              ];
            let moves = []
            for (const direction of directions) {
                let [dx, dy] = direction;
                let x = xPos + dx;
                let y = yPos + dy;
                while (!outOfBounds(x, y)) {
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y])) {
                        moves.push([x, y]);
                        if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== "passant") {
                            break;
                        }
                    } else {
                        break;
                    }
                    x += dx;
                    y += dy;
                }
              }
              
            return moves
        }
    })

    return piece;
}