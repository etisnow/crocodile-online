import fs from 'fs'
import { MessageType } from '../../shared/messageTypes.js'
import { emitter } from "../server.js"
import { findMatches, qulifyMessage } from '../utils/text.js'

const EMPTY_CANVAS_STRING = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
const SCORE_TO_WIN = 100

export const GameState = {
    WaintingForPlayers: 'WaintingForPlayers',
    Pending: 'Pending',
    StartOfTurn: 'StartOfTurn',
    Painting: 'Painting',
    EndOfTurn: 'EndOfTurn',
    EndOfGame: 'EndOfGame'
}

export class Room {
    players = {}
    playersDisconected = {}
    playerIds = []
    messages = []
    gameState = GameState.WaintingForPlayers
    currentPainterId = -1
    painterId = null
    roundWinnerId = null
    gameWinnerId = null
    words = []
    currenctWord = ''
    timer = null
    paintingTimeout = null
    startingTimeout = null
    endingTimeout = null
    canvasData = EMPTY_CANVAS_STRING

    constructor(id, link, host) {
        this.id = id
        this.link = link
        this.players[host.id] = host

        this.words = fs.readFileSync('src/server/words.txt', 'utf8')
            .split('\n')
            .map((word) => {
                const trimmed = word.trim()
                const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
                return capitalized
            })
        this.words.forEach((word) => console.log(word))

    }

    toJSON() {
        const { id, link, players } = this
        return { id, link, players }
    }

    getRoomData() {
        return {
            players: Object.values(this.players),
            messages: this.messages,
            gameState: this.gameState,
            currentPainterId: this.currentPainterId,
            currentWord: this.currenctWord,
            roundWinnerId: this.roundWinnerId,
            gameWinnerId: this.gameWinnerId,
            timer: this.timer,
            canvasData: this.canvasData
        }
    }

    connectPlayer(player) {
        const id = player.id
        if (this.playersDisconected[id]) {
            this.players[id] = this.playersDisconected[id]
            delete this.playersDisconected[id]
            this.addSystemMessage('PLAYER_RECONNETED', [this.players[id].name])
        } else {
            this.players[player.id] = {
                id: player.id,
                name: player.name,
                score: 0
            }
            this.addSystemMessage('PLAYER_CONNETED', [this.players[id].name])
        }
        this.playerIds.push(id)

        if (this.gameState === GameState.WaintingForPlayers && this.playerIds.length > 1) {
            console.log('игроков достаточно для начала игры');
            this.starNewTurn()
        }
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

    moveToDisconnected(player) {
        const id = player.id
        this.playersDisconected[id] = this.players[id]
        delete this.players[id]
        const index = this.playerIds.indexOf(id)
        if (index > -1) {
            this.playerIds.splice(index, 1)
        }
        this.addSystemMessage('PLAYER_DISCONNETED', [this.playersDisconected[id]?.name])

        if (this.gameState === GameState.EndOfGame) {
            return
        }

        if (this.gameState !== GameState.WaintingForPlayers && this.currentPainterId === id) {
            this.cancelTurn()
            this.starNewTurn()
        }

        if (this.gameState !== GameState.WaintingForPlayers && this.playerIds.length <= 1) {
            this.stopGame()
        }
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

    addMessage(player, text) {
        const messageType = qulifyMessage(text)
        if (messageType === MessageType.Common) {
            this.messages.push({
                authorName: player.name,
                authorId: player.id,
                commonText: text
            })
        } else {
            const matchedWord = findMatches(text, this.currenctWord)
            this.messages.push({
                authorName: player.name,
                authorId: player.id,
                matchedWord: matchedWord
            })
            if (this.gameState === GameState.Painting && player.id !== this.currentPainterId) {
                this.checkWord(player.id, text)
            }
        }
    }
    addSystemMessage(systemMessageType = '', systemMessagePayload = []) {
        this.messages.push({
            authorName: 'system',
            authorId: -1,
            systemMessageType,
            systemMessagePayload
        })
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

    setCavnasData(data) {
        this.canvasData = data
    }

    resetCanvasData() {
        this.canvasData = EMPTY_CANVAS_STRING
    }

    makeEvent(playerId, event, payload) {
        switch (event) {
            case 'message': {
                this.addMessage(this.players[playerId], payload)
                break
            }
            case 'canvas': {
                this.setCavnasData(payload)
                break
            }
        }
        emitter.emit('room-event' + this.link, this.getRoomData())
    }


    starNewTurn(painterId = this.playerIds[0]) {
        this.resetCanvasData()
        this.currentPainterId = painterId
        this.gameState = GameState.StartOfTurn
        this.currenctWord = ''
        this.timer = 5000
        this.addSystemMessage('PLAYER_PAINTER', [this.players[painterId].name])

        this.startingTimeout = setTimeout(() => {
            this.gameState = GameState.Painting
            this.currenctWord = this.words[Math.floor(Math.random() * this.words.length)]
            this.timer = 120000
            this.addSystemMessage('ROUND_BEGIN')
            emitter.emit('room-event' + this.link, this.getRoomData())
            this.paintingTimeout = setTimeout(() => {
                this.gameState = GameState.EndOfTurn
                this.roundWinnerId = -1
                this.addSystemMessage('TIME_ENDED', [this.currenctWord.toUpperCase()])

                const painterIndex = this.playerIds.indexOf(this.currentPainterId)
                const playersIdExcluded = this.playerIds.slice()
                playersIdExcluded.splice(painterIndex, 1)

                this.timer = 5000
                this.startingTimeout = setTimeout(() => {
                    this.starNewTurn(playersIdExcluded[Math.floor(Math.random() * playersIdExcluded.length)])
                }, this.timer);
            }, this.timer);
        }, this.timer);


    }

    cancelTurn() {
        clearTimeout(this.startingTimeout)
        clearTimeout(this.paintingTimeout)
        clearTimeout(this.endingTimeout)
        this.currenctWord = ''
        this.currentPainterId = -1
        this.gameState = GameState.EndOfTurn
        this.timer = 0
    }

    stopGame() {
        this.cancelTurn()
        this.gameState = GameState.WaintingForPlayers
        this.addSystemMessage('NOT_ENOUGH_PLAYERS')
    }

    checkWord(playerId, guessWord) {
        const propWord = this.currenctWord.toLowerCase().trim()
        guessWord = guessWord.toLowerCase().trim()
        if (propWord === guessWord) {
            clearTimeout(this.paintingTimeout)
            this.players[playerId].score += 5
            this.players[this.currentPainterId].score += 10
            this.roundWinnerId = playerId
            this.addSystemMessage('PLAYER_GUESSED_WORD', [this.players[playerId].name, propWord.toUpperCase()])

            const winner = this.checkWinner()
            if (winner) return

            this.gameState = GameState.EndOfTurn
            this.timer = 5000
            this.endingTimeout = setTimeout(() => {
                this.starNewTurn(playerId)
            }, this.timer);
        }
    }

    checkWinner() {
        const players = Object.values(this.players)
        const winner = players.find((player) => player.score >= SCORE_TO_WIN)
        if (winner) {
            this.addSystemMessage('PLAYER_WON', [winner.name], SCORE_TO_WIN)
            this.gameWinnerId = winner.id
            this.gameState = GameState.EndOfGame
            return true
        }

        return false
    }



}