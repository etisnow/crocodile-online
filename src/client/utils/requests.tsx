import axios from "axios";
import { changeGameStateAction, clearError, GameState, Message, Player, setCanvasDataAction, setError, setLoadedName, setMessagesAction, setMyId, setMyName, setPlayerList, setRoomLink, store, useAppSelector } from "../store/store";

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('authKey');

type Dispatch = typeof store.dispatch

const LOGIN_URL = '/login'
const CHANGE_NAME_URL = '/changeName'
const SUBSCRIBE_URL = `/subscribe/`
const MESSAGE_URL = '/message'
const CANVAS_URL = '/canvas'
const FIND_GAME_URL = '/find-game'

export const login = () => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.post(LOGIN_URL)
            const authKey = response.data.authKey
            window.localStorage.setItem('authKey', authKey)
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authKey')
            const id = response.data.player.id
            const name = response.data.player.name
            dispatch(setMyId(id))
            dispatch(setMyName(name))
            dispatch(setLoadedName(name))
            dispatch(clearError())
        } catch (error: any) {
            const response = error.response.data.error
            console.log(error, 'error');
            dispatch(setError(response as string))
        }
    }
}

export const changeName = (name: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.post(CHANGE_NAME_URL, {
                name: name
            })
            const newName = response.data.player.name
            dispatch(setMyName(newName))
            dispatch(setLoadedName(''))
            dispatch(clearError())
        } catch (error: any) {
            const response = error.response.data.error
            console.log(error, 'error');
            dispatch(setError(response as string))
        }
    }
}

export const findGame = () => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.get(FIND_GAME_URL)
            const roomLink = response.data
            dispatch(setRoomLink(roomLink))
            console.log(roomLink);

            dispatch(clearError())
        } catch (error: any) {
            const response = error.response.data.error
            console.log(error, 'error');
            dispatch(setError(response as string))
        }
    }
}

export const subscribe = async () => {
    try {
        const roomLink = store.getState().room.link
        const { data: { event } } = await axios.get(SUBSCRIBE_URL + roomLink)
        switch (event) {
            case 'messagesChanged': {
                const { data } = await axios.get('/messages')
                const messages: Message[] = data
                store.dispatch(setMessagesAction(messages))
                break
            }
            case 'playersChanged': {
                const { data } = await axios.get('/players')
                const players: Player[] = data
                store.dispatch(setPlayerList(players))
                break
            }
            case 'canvasChanged': {
                const response = await axios.get('/canvas')
                const canvasData: string = response.data.canvasData
                store.dispatch(setCanvasDataAction(canvasData))
                break
            }
            default: setTimeout(() => subscribe(), 2000)
        }
        //setTimeout(() => subscribe(), 2000)
    } catch (error: any) {
        console.log(error)
        if (error.response?.status === 401) {
            store.dispatch(changeGameStateAction(GameState.NotInGame))
            return
        }
        //setTimeout(() => subscribe(), 2000)
    }
}

export const sendMessage = (message: Message) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.post(MESSAGE_URL, message)
        } catch (error) {
            console.log(error, 'error');
            dispatch(setError(error as string))
        }
    }
}

export const sendCanvasData = (canvasData: string | undefined) => {
    return async (dispatch: Dispatch) => {
        console.log(typeof canvasData);

        try {
            await axios.post(CANVAS_URL, { canvasData })
        } catch (error) {
            console.log(error, 'error');
            dispatch(setError(error as string))
        }
    }
}