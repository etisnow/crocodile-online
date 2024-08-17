import { configureStore, createAction, createReducer, createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';

type State = {
    player: Player,
    room: {
        validation: RoomValidationStatus,
        validationError: string,
        link: string,
        playerList: RoomPlayer[],
        messages: Message[],
        currentWord: string,
        currentPainterId: number,
        timerServerStamp: number,
        timer: number,
        gameState: GameState,
        canvasData: string,
        roundWinnerId: number,
        gameWinnerId: number
    },
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

export enum RoomValidationStatus {
    Empty = 'Empty',
    Pending = 'Pending',
    Sucsess = 'Sucsess',
    Error = 'Error'
}

export const changeGameStateAction = createAction<GameState>('room/setGameState')
export const setTimerAction = createAction<number>('room/setTimer')
export const setRoomData = createAction<{
    players: RoomPlayer[],
    messages: Message[],
    gameState: GameState,
    currentPainterId: number,
    currentWord: string,
    roundWinnerId: number,
    gameWinnerId: number,
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
export const setRoomValidation = createAction<RoomValidationStatus>('room/setValidation')
export const setRoomValidationError = createAction<string>('room/setValidationError')
export const clearRoomValidationError = createAction('room/clearValidationError')

const initialState: State = {
    player: {
        id: null,
        name: '',
        preloadedName: '',
        isLogged: false
    },
    room: {
        validation: RoomValidationStatus.Empty,
        validationError: '',
        link: '',
        playerList: [],
        messages: [],
        currentWord: '',
        currentPainterId: -1,
        timerServerStamp: 0,
        timer: 120,
        gameState: GameState.NotInGame,
        roundWinnerId: -1,
        gameWinnerId: -1,
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
        .addCase(setRoomValidation, (state, action) => {
            state.room.validation = action.payload
        })
        .addCase(setRoomValidationError, (state, action) => {
            state.room.validationError = action.payload
        })
        .addCase(clearRoomValidationError, (state, action) => {
            state.room.validationError = ''
        })
        .addCase(setPlayerData, (state, action) => {
            state.player = action.payload
        })
        .addCase(setRoomData, (state, action) => {
            const { players, messages, gameState, currentPainterId, currentWord, canvasData, timer, roundWinnerId, gameWinnerId } = action.payload
            state.room.playerList = players
            state.room.messages = messages
            state.room.gameState = gameState
            state.room.currentPainterId = currentPainterId
            state.room.currentWord = currentWord
            state.room.canvasData = canvasData
            state.room.timerServerStamp = timer
            state.room.roundWinnerId = roundWinnerId
            state.room.gameWinnerId = gameWinnerId
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