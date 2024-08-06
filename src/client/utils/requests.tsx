import axios from "axios";
import { changeGameStateAction, clearError, GameState, setCanvasDataAction, setError, setLoadedName, setMessagesAction, setMyId, setMyName, setPlayerList, setRoomLink, store } from "../store/store";

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('authKey');

type Dispatch = typeof store.dispatch

const LOGIN_URL = '/login'
const CHANGE_NAME_URL = '/changeName'
const CONNECT_URL = `/connect`
const MESSAGE_URL = '/message'
const CANVAS_URL = '/canvas'
const FIND_GAME_URL = '/find-game'

const formRoomLink = (endPoint: string) => {
    const roomLink = window.location.pathname
    return axios.defaults.baseURL + endPoint + roomLink
}

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
            dispatch(clearError())
        } catch (error: any) {
            const response = error.response.data.error
            console.log(error, 'error');
            dispatch(setError(response as string))
        }
    }
}

export const connect = async () => {
    try {
        const eventSource = new EventSource(formRoomLink(CONNECT_URL))
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            store.dispatch(setPlayerList(data.players))
            store.dispatch(setMessagesAction(data.messages))
            store.dispatch(setCanvasDataAction(data.canvasData))
        }

    } catch (error: any) {
        console.log(error)
        if (error.response?.status === 401) {
            store.dispatch(changeGameStateAction(GameState.NotInGame))
            return
        }
    }
}

export const sendMessage = (message: string) => {
    return async (dispatch: Dispatch) => {
        try {
            await axios.post(formRoomLink(MESSAGE_URL), { message })
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
            await axios.post(formRoomLink(CANVAS_URL), { canvasData })
        } catch (error) {
            console.log(error, 'error');
            dispatch(setError(error as string))
        }
    }
}