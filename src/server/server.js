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

app.post("/message/:roomLink", (req, res) => {
    const message = req.body.message
    const authKey = req.headers.authorization
    const roomLink = req.params.roomLink
    res.status(200)
    res.end('Message has arrived')
    lobby.roomEvent(authKey, roomLink, 'message', message)
});

app.post("/canvas/:roomLink", (req, res) => {
    const canvasData = req.body.canvasData
    const roomLink = req.params.roomLink
    const authKey = req.headers.authorization
    res.status(200)
    res.end('Canvas has arrived')
    lobby.roomEvent(authKey, roomLink, 'canvas', canvasData)
});


app.get('/find-game', (req, res) => {
    const authKey = req.headers.authorization
    const nameValidation = lobby.validateName(authKey)
    console.log(nameValidation);

    if (nameValidation.error) {
        res.status(400)
        res.json(nameValidation)
        res.end()
        return
    }
    const roomLink = lobby.findGame(authKey)
    res.json(roomLink)
})

app.get('/enter-room/:roomLink', (req, res) => {
    const authKey = req.headers.authorization
    const nameValidation = lobby.validateName(authKey)
    if (nameValidation.error) {
        res.status(400)
        res.json(nameValidation)
        res.end()
        return
    }

    const roomLink = req.params.roomLink
    const roomValidation = lobby.validateRoom(roomLink)
    if (roomValidation.error) {
        res.status(400)
        res.json(roomValidation)
        res.end()
        return
    }

    res.status(200)
    res.end()
    console.log('room validated');

})

app.get("/connect/:roomLink", (req, res) => {
    const authKey = req.headers.authorization
    const roomLink = req.params.roomLink
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-control': 'no-cache'
    })
    const roomInfo = lobby.enterRoom(authKey, roomLink)
    res.write(`data: ${JSON.stringify(roomInfo)} \n\n`)
    emitter.on('room-event' + roomLink, (data) => {
        res.write(`data: ${JSON.stringify(data)} \n\n`)
    })
    req.on("close", () => {
        console.log('connection closed');
        lobby.disconnect(authKey, roomLink)
    });
    console.log(emitter.listenerCount());
});


server.listen(PORT, 'localhost', error => {
    error ? console.log(error) : console.log(`listening port ${PORT}`)
})