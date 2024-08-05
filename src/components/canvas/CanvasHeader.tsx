import { selectAmIPainter } from "../../store/selectors"
import { useAppSelector } from "../../store/store"
import Timer from "./Timer"

const CanvasHeader = () => {
    const currentPainterId = useAppSelector((state) => state.room.currentPainterId)
    const playerList = useAppSelector((state) => state.room.playerList)
    const currentWord = useAppSelector((state) => state.room.currentWord)
    const currentPlayer = playerList.find((player) => player.id === currentPainterId)
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))

    return (
        <div className="canvas-header">
            <div className="canvas-painter-info">
                <span className='canvas-painter-name'>{currentPlayer?.name ? currentPlayer?.name : 'Ожидание других игроков..'}</span>
            </div>
            <div className="canvas-word-info">
                {amIPainter && <span>{currentWord}</span>}
            </div>
            <Timer />
        </div>
    )
}

export default CanvasHeader