import { selectAmIPainter } from "../../store/selectors"
import { useAppSelector } from "../../store/store"
import PlayerName from "../UI/Player/PlayerName"
import Timer from "./Timer"

const CanvasHeader = () => {
    const currentPainterId = useAppSelector((state) => state.room.currentPainterId)
    const playerList = useAppSelector((state) => state.room.playerList)
    const currentWord = useAppSelector((state) => state.room.currentWord)
    const currentPlayer = playerList.find((player) => player.id === currentPainterId)
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))
    const gameState = useAppSelector((state) => state.room.gameState)

    return (
        <div className="canvas-header">
            <div className="canvas-painter-info">
                <PlayerName name={currentPlayer?.name} avatar={currentPlayer?.avatar}></PlayerName>
            </div>
            <div className="canvas-word-info">
                {currentWord && amIPainter && <span>{currentWord}</span>}
            </div>
            <Timer />
        </div>
    )
}

export default CanvasHeader