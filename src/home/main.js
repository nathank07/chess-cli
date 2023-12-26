import './home.css'
import newGame, { existingGame } from "../game/websockets.js"
import { changePlayerSide } from "../chess/modify.js"
import { importGame } from '../chess/board.js'
import { createTimerDiv } from '../game/main.js'

loadGames()

document.querySelector("#create-game").addEventListener('click', () => {
    newGame(false)
        .then(game => {
            window.location.href += `${game.id}`
        })
        .catch(error => {
            console.log(error)
        })
})

async function loadGames() {
    const liveGames = await getLive()
    const finishedGames = await getFinishedGames()
    const live = document.querySelector('#game-list')
    const finished = document.querySelector('#game-history')
    createBoards(liveGames, live)
    createBoards(finishedGames, finished)
} 

function getLive() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/live')
            const games = await res.json()
            if(!games) {
                resolve([])
                return
            }
            const importedGames = []
            await Promise.all(games.map(async game => {
                const importedGame = await existingGame(game)
                importedGames.push(importedGame)
            }));
            resolve(importedGames)
        }
        catch (e) {
            reject(e)
        }
    })
}

function getFinishedGames() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/games')
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

function createBoards(games, divHolder) {
    games.forEach(game => {
        const parent = document.createElement('a')
        const players = document.createElement('div')
        const whiteTimer = document.createElement('div')
        const blackTimer = document.createElement('div')
        const id = game.id
        whiteTimer.setAttribute('gameid', id) 
        blackTimer.setAttribute('gameid', id) 
        whiteTimer.id = 'whiteTimer'
        blackTimer.id = 'blackTimer'
        players.classList.add('preview-players')
        players.appendChild(game.whiteUserSpan)
        const vs = document.createElement('span')
        vs.textContent = " vs "
        players.appendChild(vs)
        players.appendChild(game.blackUserSpan)
        parent.appendChild(players)
        parent.appendChild(game.div)
        parent.appendChild(whiteTimer)
        parent.appendChild(blackTimer)
        parent.setAttribute('id', id)
        parent.href = window.location.href + id
        changePlayerSide(game, true)
        if(game.whiteClock && game.blackClock) {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        }
        divHolder.appendChild(parent)
    });
}