import './home.css'
import '../header/header.css'
import '../footer/footer.css'
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'
import createLiveBoards from './livegames.js'
import linkDialog from './dialog.js'
import showCompleteList from './completegames.js'

loadGames()

const createGameDialog = document.querySelector('dialog')
linkDialog(createGameDialog)

async function loadGames() {
    const live = document.querySelector('#game-list')
    const finished = document.querySelector('#game-history-list')
    createLiveBoards(live)
    showCompleteList(finished, false)  
} 
