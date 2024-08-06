import md5 from "js-md5";
import { Player } from './player.js';
import { Room } from "./room.js";

export class Lobby {
    rooms = {}
    roomIds = []
    players = {}
    authList = []

    ROOM_MAX_PLAYERS = 2

    startNewRoom(hostPlayer) {
        const id = this.roomIds.length
        const link = md5(id.toString())
        this.roomIds[id] = id
        this.rooms[id] = new Room(id, link, hostPlayer)

        return id
    }

    validateName(newName) {
        return Object.values(this.players).some((player) => player.name === newName)
    }

    generateAuthKey() {
        return Math.random().toString()
    }

    findRoom() {
        if (this.roomIds.length === 0) return null

        const rooms = Object.values(this.rooms)
        const room = rooms.find((room) => room.playerIds.length < this.ROOM_MAX_PLAYERS)
        if (room) {
            console.log('room found' + room.id);
            return room.id
        }
        console.log('room not found');

        return null
    }

    registerPlayer(name) {
        const authKey = this.generateAuthKey()
        this.authList.push(authKey)
        const id = this.authList.length

        const player = new Player(id, '')
        this.players[authKey] = player

        return authKey
    }

    loginPlayer(authKey) {
        if (!this.players[authKey]) {
            authKey = this.registerPlayer()
        }
        const player = this.players[authKey]
        return { player, authKey }
    }

    changePlayerName(newName, authKey) {
        const player = this.players[authKey]
        if (newName) player.name = newName

        return { player }
    }


    findGame(authKey) {
        const player = this.players[authKey]

        let roomId = this.findRoom()

        if (roomId === null) {
            roomId = this.startNewRoom(player)
        }
        player.moveToRoom(roomId)

        const room = this.rooms[roomId]
        room.addPlayer(player)

        //console.log(this.rooms);
        //console.log(this.roomIds);


        return room.link
    }

    connect(authKey, roomLink) {
        const player = this.players[authKey]
        const rooms = Object.values(this.rooms)
        const room = rooms.find((room) => room.link === roomLink)

        console.log(player, room)
    }

    roomEvent(authKey, roomLink, event, payload) {
        const player = this.players[authKey]
        const rooms = Object.values(this.rooms)
        const room = rooms.find((room) => room.link === roomLink)
        rooms[room.id].makeEvent(player.id, event, payload)
    }

    getRoomData(roomLink) {
        const rooms = Object.values(this.rooms)
        const room = rooms.find((room) => room.link === roomLink)
        const roomData = room.getRoomData()
        return roomData
    }
}
