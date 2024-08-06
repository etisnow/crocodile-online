import { createAppSelector, GameState } from "./store";

export const selectAmIPainter = createAppSelector(
    [
        (state) => state.player.id,
        (state) => state.room.currentPainterId
    ],
    (myId, state) => myId === state
)

export const selectCanvasData = createAppSelector(
    [(state) => state.room.canvasData],
    (canvasData) => canvasData
)

export const selectInGame = createAppSelector(
    [(state) => state.room.gameState],
    (gameState) => gameState != GameState.NotInGame
)