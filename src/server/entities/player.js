import { emitter } from "../server.js"

export class Player {
    static timeout

    constructor(id, name, roomId = null) {
        this.id = id
        this.name = name
        this.avatar = Math.ceil(Math.random() * 16)
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
        const { id, name, score, avatar } = this
        return { id, name, score, avatar }
    }

}

export default Player