import bodyParser from 'body-parser';
import cors from 'cors';
import EventEmitter from 'events';
import express from 'express';
import http from 'http';
import { Lobby } from './entities/lobby.js';

const PORT = 3000;

const app = express()
const server = http.createServer(app)
export const emitter = new EventEmitter()
const lobby = new Lobby()


app.use(cors())
app.use(bodyParser.json({ limit: '1mb' }))
app.set('port', PORT)


const room = {
    playersList: {},
    authList: {},
    messages: [],
    canvasData: '',
    currentWord: 'Жучок'
}

export const isAuthorized = (req, res, next) => {
    if ((req.path === '/login') || (req.path === '/relogin')) return next()
    const authKey = req.headers.authorization

    if (authKey in room.authList) {
        const id = room.authList[authKey]
        req.id = id
        return next()
    }
    res.status(401)
    res.json({ error: 'Аутенфикация не пройдена' })
}
//app.use(isAuthorized)

app.post("/login", (req, res) => {
    const name = req.body.name
    const authKey = req.headers.authorization
    const data = lobby.loginPlayer(authKey)
    res.json(data)
});

app.post("/changeName", (req, res) => {
    const newName = req.body.name
    const authKey = req.headers.authorization
    const data = lobby.changePlayerName(newName, authKey)
    res.json(data)
});

app.post("/message", (req, res) => {
    const message = req.body
    room.messages.push(message)
    res.status(200)
    res.end('Message has arrived')
    emitter.emit('subscribe', 'messagesChanged')
});

app.post("/canvas", (req, res) => {
    const canvasData = req.body
    room.canvasData = canvasData
    res.status(200)
    res.end('Canvas has arrived')
    emitter.emit('subscribe', 'canvasChanged')
});


app.get('/find-game', (req, res) => {
    const authKey = req.headers.authorization
    const roomLink = lobby.findGame(authKey)
    res.json(roomLink)
})

app.get("/subscribe", (req, res) => {
    const id = req.id
    const player = room.playersList[id]
    player.setActive()
    emitter.once('subscribe', (event) => {
        res.json({ event })
        clearTimeout(reset)
    })
    const reset = setTimeout(() => {
        emitter.emit('subscribe', 'subscribeReset')
        console.log('subscribeReset', id);
    }, 8000);
    console.log(emitter.listeners('subscribe').length)
});

app.get('/messages', (req, res) => {
    const messages = room.messages
    res.json(messages)
})

app.get('/players', (req, res) => {
    const playersList = Object.values(room.playersList).filter((player) => player.isActive)
    res.json(playersList)
})

app.get('/canvas', (req, res) => {
    const canvasData = room.canvasData
    res.send(canvasData)
})




server.listen(PORT, 'localhost', error => {
    error ? console.log(error) : console.log(`listening port ${PORT}`)
})