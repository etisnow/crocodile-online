import { emitter } from "../server.js"


export class Room {
    players = {}
    playerIds = []
    messages = []
    canvasData = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

    constructor(id, link, host) {
        this.id = id
        this.link = link
        this.players[host.id] = host
    }

    toJSON() {
        const { id, link, players } = this
        return { id, link, players }
    }

    getRoomData() {
        return {
            players: Object.values(this.players),
            messages: this.messages,
            canvasData: this.canvasData
        }
    }

    addPlayer(player) {
        this.players[player.id] = {
            id: player.id,
            name: player.name,
            score: 0
        }
        this.playerIds.push(player.id)
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

    addMessage(player, text) {
        this.messages.push({
            authorName: player.name,
            authorId: player.id,
            body: text
        })
    }

    setCavnasData(data) {
        this.canvasData = data
    }

    makeEvent(playerId, event, payload) {
        switch (event) {
            case 'message': {
                this.addMessage(this.players[playerId], payload)
            }
            case 'canvas': {
                this.setCavnasData(payload)
            }
        }
        emitter.emit('room-event' + this.link, this.getRoomData())
    }

}