
import { configureStore, createAction, createReducer, createSelector } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'

type State = {
    player: {
        id: number | null,
        name: string,
        preloadedName: string
    },
    room: {
        link: string,
        playerList: Player[],
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

export const addMessageAction = createAction<{ authorId: number, authorName: string, body: string }>(Actions.AddMessage)
export const setMessagesAction = createAction<{ authorId: number, authorName: string, body: string }[]>(Actions.SetMessages)
export const timerTickAction = createAction(Actions.TickTimer)
export const changeGameStateAction = createAction<GameState>(Actions.ChangeGameState)
export const setTimerAction = createAction<number>(Actions.SetTimer)
export const changeCurrentPainterIdAction = createAction<number>(Actions.ChangeCurrentPainterId)
export const setCanvasDataAction = createAction<string>(Actions.SetCanvasData)
export const setPlayerList = createAction<Player[]>(Actions.SetPlayerList)

export const setError = createAction<string>('error/set')
export const clearError = createAction('error/clear')

export const setMyId = createAction<number>('player/setMyId')
export const setMyName = createAction<string>('player/setMyName')
export const setLoadedName = createAction<string>('player/setLoadedName')

export const setRoomLink = createAction<string>('room/setLink')

const initialState: State = {
    player: {
        id: null,
        name: '',
        preloadedName: ''
    },
    room: {
        link: '',
        playerList: [],
        messages: [],
        currentWord: 'Похмелье',
        currentPainterId: 1,
        timerServerStamp: Date.now(),
        timer: 120,
        gameState: GameState.NotInGame,
        canvasData: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    },
    error: ''
}

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setPlayerList, (state, action) => {
            state.room.playerList = action.payload
        })
        .addCase(addMessageAction, (state, action) => {
            state.room.messages.push({
                authorId: action.payload.authorId,
                authorName: action.payload.authorName,
                body: action.payload.body
            })
        })
        .addCase(setMessagesAction, (state, action) => {
            state.room.messages = action.payload
        })
        .addCase(timerTickAction, (state) => {
            state.room.timer = state.room.timer - 1
        })
        .addCase(changeGameStateAction, (state, action) => {
            state.room.gameState = action.payload
        })
        .addCase(setTimerAction, (state, action) => {
            state.room.timer = action.payload
        })
        .addCase(changeCurrentPainterIdAction, (state, action) => {
            state.room.currentPainterId = action.payload
        })
        .addCase(setCanvasDataAction, (state, action) => {
            state.room.canvasData = action.payload
        })
        .addCase(setError, (state, action) => {
            state.error = action.payload
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