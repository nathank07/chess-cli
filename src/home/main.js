import './home.css'
import '../header/header.css'
import '../footer/footer.css'
import newGame, { existingGame } from "../game/websockets.js"
import { changePlayerSide } from "../chess/modify.js"
import { importGame } from '../chess/board.js'
import { createTimerDiv } from '../game/main.js'

loadGames()

const createGameDialog = document.querySelector('dialog')
createGameDialog.querySelector('#length').onchange = () => {
    const length = createGameDialog.querySelector('#length').value
    createGameDialog.querySelector('#length-span').textContent = length
}
createGameDialog.querySelector('#increment').onchange = () => {
    const increment = createGameDialog.querySelector('#increment').value
    createGameDialog.querySelector('#increment-span').textContent = increment
}

createGameDialog.querySelector('#create-final').addEventListener('click', async () => {
    const timeControl = {
        seconds: Number(createGameDialog.querySelector('#length').value),
        increment: Number(createGameDialog.querySelector('#increment').value)
    }
    const fen = createGameDialog.querySelector('#fen').value
    const isBlack = !createGameDialog.querySelector('#white').checked
    console.log(isBlack)
    const game = await newGame(fen, timeControl)
    window.location.href = window.location.href + game.id + `${isBlack ? "?black=true" : ""}`
})

document.querySelector("#create-game").addEventListener('click', () => {
    createGameDialog.showModal()
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
            const res = await fetch('/api/game/live', { cache: "no-cache" })
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

function createBoards(games, divHolder) {
    if(games.length === 0) {
        divHolder.replaceWith(createLiveEmpty())
        return
    }
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
        parent.href = `${window.location.origin}/game/${id}`
        changePlayerSide(game, true)
        if(game.whiteClock && game.blackClock) {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        }
        divHolder.appendChild(parent)
    });
}

function createLiveEmpty() {
    const messageContainer = document.createElement('div')

    const message = document.createElement('h2')
    message.textContent = "No Live Games"
    const emoji = document.createElement('div')
    emoji.textContent = "😢"
    emoji.classList.add('large-emoji')

    const createGameButton = document.createElement('button')
    createGameButton.textContent = "Create a New Game"
    createGameButton.id = "create-game"
    createGameButton.addEventListener('click', () => {
        createGameDialog.showModal()
    })

    messageContainer.appendChild(emoji)
    messageContainer.appendChild(message)
    messageContainer.appendChild(createGameButton)
    messageContainer.id = "no-games"
    
    return messageContainer
}