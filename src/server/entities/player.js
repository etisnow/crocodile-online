import { emitter } from "../server.js"

export class Player {
    static timeout

    constructor(id, name, roomId = null) {
        this.id = id
        this.name = name
        this.roomId = roomId
        this.isActive = true
        console.log('new player constructed');
    }

    setActive() {
        this.isActive = true
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.isActive = false
            emitter.emit('subscribe', 'playersChanged')
        }, 10000)
    }

    toJSON() {
        const { id, name, score } = this
        return { id, name, score }
    }

    moveToRoom(roomId) {
        this.roomId = roomId
    }

}

export default Player