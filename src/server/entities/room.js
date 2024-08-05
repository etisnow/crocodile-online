import { emitter } from "../server.js"


export class Room {
    players = {}
    playerIds = []

    constructor(id, link, host) {
        this.id = id
        this.link = link
        this.players[host.id] = host
    }

    toJSON() {
        const { id, link, players } = this
        return { id, link, players }
    }

    addPlayer(player) {
        this.players[player.id] = player
        emitter.emit('subscribe', 'playersChanged')
    }

}