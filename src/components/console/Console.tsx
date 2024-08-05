import { selectAmIPainter } from "../../store/selectors"
import { changeCurrentPainterIdAction, changeGameStateAction, GameState, useAppDispatch, useAppSelector } from "../../store/store"

const Console = () => {
    const dispatch = useAppDispatch()
    const playerList = useAppSelector((state) => state.room.playerList)
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))
    const myId = useAppSelector((state) => state.player.id)
    const gameState = useAppSelector(state => state.room.gameState)

    return (
        <div className="console" style={{ display: 'none', fontSize: '22px' }}>
            <div>GameState</div>
            <select
                onChange={(e) => {
                    const value = e.target.value
                    const newState = GameState[value as keyof typeof GameState]
                    dispatch(changeGameStateAction(newState))
                }}
                value={gameState}
            >
                {
                    Object.keys(GameState).map((state, i) =>
                        <option key={i}>{state}</option>
                    )
                }
            </select>
            <div>ChangeCurrentPlayer</div>
            <select onChange={(e) => dispatch(changeCurrentPainterIdAction(+e.target.value))}>
                {
                    playerList.map((player, i) =>
                        <option key={i} value={player.id}>{player.name}</option>
                    )
                }
            </select>
            <div>Am I Painter: {amIPainter ? 'yes' : 'no'}</div>
            <div>My Id: {myId}</div>
        </div>
    )
}

export default Console