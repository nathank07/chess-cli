import { importGame } from '../chess/board.js'

export default function getFinishedGames() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/api/game/games', { cache: "no-cache" })
            const games = await res.json()
            const importedGames = []
            games.forEach(game => {
                const importedGame = importGame([game.fen, [...game.uci.split(' ')]])
                importedGame.id = game.id
                importedGame.whiteUserSpan.textContent = game.whitePlayer
                importedGame.blackUserSpan.textContent = game.blackPlayer
                importedGames.push(importedGame)
            });
            resolve(importedGames)
        }
        catch (e) {
            reject(e)
        }
    })
}
