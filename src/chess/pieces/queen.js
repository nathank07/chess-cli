import Rook from "./rook.js"
import Bishop from "./bishop.js"
import { Piece } from "./piece.js"

export default function Queen( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "queen",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,
        standardMoves: () => {
            const bishop = Bishop({ isWhite: isWhite, xPos: xPos, yPos: yPos, game: game });
            const rook = Rook({ isWhite: isWhite, xPos: xPos, yPos: yPos, game: game });
            return bishop.standardMoves().concat(rook.standardMoves())
        }
    })
    return piece;
}