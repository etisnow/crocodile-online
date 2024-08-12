import { configureStore, createAction, createReducer, createSelector } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'

type State = {
    player: Player,
    room: {
        link: string,
        playerList: RoomPlayer[],
        messages: Message[],
        currentWord: string,
        currentPainterId: number,
        timerServerStamp: number,
        timer: number,
        gameState: GameState,
        canvasData: string
    }
    error: string
}

export interface Player {
    id: number | null,
    name: string,
    preloadedName: string,
    isLogged: boolean
}

export interface RoomPlayer {
    id: number,
    name: string,
    score: number
}

export interface Message {
    authorId: number,
    authorName: string,
    body: string
}

export enum GameState {
    NotInGame = 'NotInGame',
    WaintingForPlayers = 'WaintingForPlayers',
    Pending = 'Pending',
    StartOfTurn = 'StartOfTurn',
    Painting = 'Painting',
    EndOfTurn = 'EndOfTurn',
    EndOfGame = 'EndOfGame'
}

export enum Actions {
    SetPlayerList = 'SetPlayerList',
    AddMessage = 'AddMessage',
    SetMessages = 'setMessages',
    ChangeCurrentWord = 'ChangeCurrentWord',
    ChangeCurrentPainterId = 'ChangeCurrentPainter',
    NewTimerServerStamp = 'NewTimerServerStamp',
    TickTimer = 'TickTimer',
    SetTimer = 'SetTimer',
    ChangeGameState = 'ChangeGameState',
    SetCanvasData = 'SetCanvasData'
}

export const changeGameStateAction = createAction<GameState>(Actions.ChangeGameState)
export const setTimerAction = createAction<number>(Actions.SetTimer)
export const setRoomData = createAction<{
    players: RoomPlayer[],
    messages: Message[],
    gameState: GameState,
    currentPainterId: number,
    currentWord: string,
    timer: number,
    canvasData: string
}>('room/setRoomData')

export const setError = createAction<string>('error/set')
export const clearError = createAction('error/clear')

export const setPlayerData = createAction<Player>('player/setData')
export const setMyId = createAction<number>('player/setMyId')
export const setMyName = createAction<string>('player/setMyName')
export const setLoadedName = createAction<string>('player/setLoadedName')
export const setRoomLink = createAction<string>('room/setLink')

const initialState: State = {
    player: {
        id: null,
        name: '',
        preloadedName: '',
        isLogged: false
    },
    room: {
        link: '',
        playerList: [],
        messages: [],
        currentWord: '',
        currentPainterId: -1,
        timerServerStamp: 0,
        timer: 120,
        gameState: GameState.NotInGame,
        canvasData: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    },
    error: ''
}

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeGameStateAction, (state, action) => {
            state.room.gameState = action.payload
        })
        .addCase(setTimerAction, (state, action) => {
            state.room.timer = action.payload
        })
        .addCase(setError, (state, action) => {
            state.error = action.payload
        })
        .addCase(clearError, (state, action) => {
            state.error = ''
        })
        .addCase(setMyId, (state, action) => {
            state.player.id = action.payload
        })
        .addCase(setMyName, (state, action) => {
            state.player.name = action.payload
        })
        .addCase(setLoadedName, (state, action) => {
            state.player.preloadedName = action.payload
        })
        .addCase(setRoomLink, (state, action) => {
            state.room.link = action.payload
        })
        .addCase(setPlayerData, (state, action) => {
            state.player = action.payload
        })
        .addCase(setRoomData, (state, action) => {
            const { players, messages, gameState, currentPainterId, currentWord, canvasData, timer } = action.payload
            state.room.playerList = players
            state.room.messages = messages
            state.room.gameState = gameState
            state.room.currentPainterId = currentPainterId
            state.room.currentWord = currentWord
            state.room.canvasData = canvasData
            state.room.timerServerStamp = timer
        })
})

export const store = configureStore({
    reducer: reducer
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppStore = useStore.withTypes<typeof store>()
export const createAppSelector = createSelector.withTypes<AppState>()