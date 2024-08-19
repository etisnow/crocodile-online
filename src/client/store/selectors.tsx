import { createAppSelector, GameState } from "./store";

export const selectAmIPainter = createAppSelector(
    [
        (state) => state.player.id,
        (state) => state.room.currentPainterId
    ],
    (myId, state) => myId === state
)

export const selectInGame = createAppSelector(
    [(state) => state.room.link],
    (link) => link != ''
)

export const selectIsPainting = createAppSelector(
    [(state) => state.room.gameState],
    (gameState) => gameState === GameState.Painting
)

export const selectCurrentPainterName = createAppSelector(
    [
        (state) => state.room.playerList,
        (state) => state.room.currentPainterId
    ],
    (playerList, currentPainterId) => Object.values(playerList).find((player) => player.id === currentPainterId)?.name
)

export const selectRoundWinnerName = createAppSelector(
    [
        (state) => state.room.playerList,
        (state) => state.room.roundWinnerId
    ],
    (playerList, roundWinnerId) => Object.values(playerList).find((player) => player.id === roundWinnerId)?.name
)

export const selectGameWinnerName = createAppSelector(
    [
        (state) => state.room.playerList,
        (state) => state.room.gameWinnerId
    ],
    (playerList, gameWinnerId) => Object.values(playerList).find((player) => player.id === gameWinnerId)?.name
)