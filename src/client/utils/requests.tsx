import axios from "axios";
import EventSource from "eventsource";
import { clearError, clearRoomValidationError, RoomValidationStatus, setError, setLoadedName, setMyName, setPlayerData, setRoomData, setRoomLink, setRoomValidation, setRoomValidationError, store } from "../store/store";

const NGROK_URL = 'https://6175-176-115-145-250.ngrok-free.app'

axios.defaults.baseURL = window.location.href.includes('localhost') ? 'http://localhost:3000' : NGROK_URL
axios.defaults.headers.common['Authorization'] = localStorage.getItem('authKey')
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true'

type Dispatch = typeof store.dispatch

const LOGIN_URL = '/login'
const CHANGE_NAME_URL = '/changeName'
const CONNECT_URL = `/connect`
const MESSAGE_URL = '/message'
const CANVAS_URL = '/canvas'
const FIND_GAME_URL = '/find-game'
const ENTER_ROOM_URL = '/enter-room'

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
            dispatch(setPlayerData({ id, name, preloadedName: name, isLogged: true }))
        } catch (error: any) {
            console.log(error, 'error');
            dispatch(setError('Ошибка авторизации'))
            setTimeout(() => {
                login()
            }, 2000)
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
            console.log(response, 'error');
            dispatch(setError('Ошибка авторизации'))
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

export const enterRoom = () => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setRoomValidation(RoomValidationStatus.Pending))
            await axios.get(formRoomLink(ENTER_ROOM_URL))
            dispatch(setRoomValidation(RoomValidationStatus.Sucsess))
            dispatch(clearRoomValidationError())
            console.log('Room Entered');
        } catch (error: any) {
            const response = error.response.data.error
            console.log(response)
            if (response === 'Комната не найдена') {
                dispatch(setError(response))
            }
            dispatch(setRoomValidation(RoomValidationStatus.Error))
            dispatch(setRoomValidationError(response))
        }
    }
}

export const connect = () => {
    const eventSource = new EventSource(formRoomLink(CONNECT_URL), {
        headers: {
            'Authorization': localStorage.getItem('authKey'),
            'ngrok-skip-browser-warning': 'true'
        }
    })
    eventSource.onerror = (e: any) => {
        console.log(e)
        store.dispatch(setError('Ошибка соединения'))
        store.dispatch(setRoomLink(''))
        eventSource.close()
    }
    eventSource.onmessage = (event: any) => {
        const data = JSON.parse(event.data)
        store.dispatch(setRoomData(data))
    }
    window.addEventListener('unload', () => {
        eventSource.close();
        console.log('Соединение EventSource закрыто.');
    });
    return eventSource
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
        try {
            await axios.post(formRoomLink(CANVAS_URL), { canvasData })
        } catch (error) {
            console.log(error, 'error');
            dispatch(setError('Ошибка соединения'))
        }
    }
}