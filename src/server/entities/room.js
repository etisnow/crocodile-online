import fs from 'fs'
import { emitter } from "../server.js"

const EMPTY_CANVAS_STRING = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const GameState = {
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
    words = []
    currenctWord = ''
    timer = null
    paintingTimeout = null
    startingTimeout = null
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
            timer: this.timer,
            canvasData: this.canvasData
        }
    }

    connectPlayer(player) {
        const id = player.id
        if (this.playersDisconected[id]) {
            this.players[id] = this.playersDisconected[id]
            delete this.playersDisconected[id]
            this.addSystemMessage(this.players[id].name, 'вернулся в игру')
        } else {
            this.players[player.id] = {
                id: player.id,
                name: player.name,
                score: 0
            }
            this.addSystemMessage(this.players[id].name, 'присоединился к комнате')
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
        this.addSystemMessage(this.playersDisconected[id]?.name, 'отсоединился')

        if (this.gameState !== GameState.WaintingForPlayers && this.playerIds.length <= 1) {
            this.canelTurn()
        }
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

    addMessage(player, text) {
        this.messages.push({
            authorName: player.name,
            authorId: player.id,
            body: text
        })
        if (this.gameState === GameState.Painting && player.id !== this.currentPainterId) {
            this.checkWord(player.id, text)
        }
    }
    addSystemMessage(textHighlighted, text) {
        this.messages.push({
            authorName: textHighlighted,
            authorId: -1,
            body: text
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
        this.addSystemMessage(this.players[painterId].name, 'становится ведущим')

        this.startingTimeout = setTimeout(() => {
            this.gameState = GameState.Painting
            this.currenctWord = this.words[Math.floor(Math.random() * this.words.length)]
            this.timer = 120000
            this.addSystemMessage('', 'Время пошло!')
            emitter.emit('room-event' + this.link, this.getRoomData())
            this.paintingTimeout = setTimeout(() => {
                this.gameState = GameState.EndOfTurn
                this.addSystemMessage(`Время закончилось. Никто не угадал слово ${this.currenctWord.toUpperCase()}`)

                const painterIndex = this.playerIds.indexOf(this.currentPainterId)
                const playersIdExcluded = this.playerIds.slice()
                playersIdExcluded.splice(painterIndex, 1)

                this.starNewTurn(playersIdExcluded[Math.floor(Math.random() * playersIdExcluded.length)])
            }, this.timer);
        }, this.timer);


    }

    canelTurn() {
        clearTimeout(this.startingTimeout)
        clearTimeout(this.paintingTimeout)
        this.currenctWord = ''
        this.currentPainterId = -1
        this.gameState = GameState.WaintingForPlayers
        this.timer = 0
        this.addSystemMessage('Недостаточно игроков. Игра на паузе')
    }

    checkWord(playerId, guessWord) {
        const propWord = this.currenctWord.toLowerCase().trim()
        guessWord = guessWord.toLowerCase().trim()
        if (propWord === guessWord) {
            clearTimeout(this.paintingTimeout)
            this.addSystemMessage(this.players[playerId].name, `угадывает слово ${propWord.toUpperCase()}`)
            this.players[playerId].score += 5
            this.players[this.currentPainterId].score += 10
            this.gameState = GameState.EndOfTurn
            this.starNewTurn(playerId)
        }
    }





}