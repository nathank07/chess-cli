import { importGame } from '../chess/board.js'
import { changePlayerSide } from '../chess/modify.js'

export function getFinishedGames() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/api/game/games', { cache: "no-cache" })
            const games = await res.json()
            const importedGames = []
            games.forEach(game => {
                const importedGame = importGame([game.fen, [...game.uci.split(' ')]])
                changePlayerSide(importedGame, true)
                Object.assign(importedGame, game)
                importedGames.push(importedGame)
            });
            resolve(importedGames)
        }
        catch (e) {
            reject(e)
        }
    })
}

export default async function showCompleteList(divHolder, userOnly) {
    // Note to self: Use stuff from google material icons to represent reason for losing
    const games = await getFinishedGames()
    const preview = document.querySelector('#game-preview')
    games.forEach(game => {
        const link = document.createElement('a')
        const boardParent = document.createElement('div')
        boardParent.appendChild(game.div)
        const date = document.createElement('div')
        const timeControl = document.createElement('div')
        const white = document.createElement('div')
        const black = document.createElement('div')
        const players = document.createElement('div')
        const result = document.createElement('div')
        const reason = document.createElement('div')
        
        date.classList.add('date')
        timeControl.classList.add('time-control')
        players.classList.add('players')
        white.classList.add('white-player')
        black.classList.add('black-player')
        boardParent.id = 'preview-board'
        result.classList.add('result')

        date.innerHTML = formatDate(game.game_created)
        timeControl.innerHTML = game.time_control
        white.innerHTML = `<div class="side"></div><span>${game.whitePlayer}</span>`
        black.innerHTML = `<div class="side"></div><span>${game.blackPlayer}</span>`
        result.innerHTML = game.winner
        reason.innerHTML = game.reason

        players.appendChild(white)
        players.appendChild(black)
        link.appendChild(timeControl)
        link.appendChild(players)
        link.appendChild(result)
        link.appendChild(reason)
        link.appendChild(date)
        link.href = `${window.location.origin}/game/${game.id}`
        link.addEventListener('mouseenter', () => {
            preview.removeChild(preview.querySelector('#preview-board'));
            preview.appendChild(boardParent);
        });
        divHolder.appendChild(link)
    });
    preview.appendChild(games[0].div.parentNode)

}

function formatDate(date) {
    const now = new Date();
    const gameDate = new Date(date);
    const diff = now - gameDate;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
        return `${minutes} Minute${minutes === 1 ? "" : "s"} Ago`;
    } else if (hours < 24) {
        return `${hours} Hour${hours === 1 ? "" : "s"} Ago`;
    } else if (days < 15) {
        return `${days} Day${days === 1 ? "" : "s"} Ago`;
    } else {
        const month = gameDate.toLocaleString('default', { month: 'short' });
        const day = gameDate.getDate();
        const year = gameDate.getFullYear();
        return `${month} ${day}, ${year}`;
    }
}
