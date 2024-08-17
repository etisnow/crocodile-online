import { selectAmIPainter, selectCurrentPainterName, selectGameWinnerName, selectRoundWinnerName } from "../../store/selectors"
import { GameState, useAppSelector } from "../../store/store"


const CanvasInfo = () => {

    let InfoText = () => <></>
    const gameState = useAppSelector((state) => state.room.gameState)
    const currentPainterName = useAppSelector((state) => selectCurrentPainterName(state))
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))
    const currentWord = useAppSelector((state) => state.room.currentWord)
    const roundWinnerName = useAppSelector((state) => selectRoundWinnerName(state))
    const gameWinnerName = useAppSelector((state) => selectGameWinnerName(state))

    switch (gameState) {
        case GameState.WaintingForPlayers: {
            InfoText = () => <span className='canvas-info-text'>Ожидание игроков...</span>
            break
        }
        case GameState.StartOfTurn: {
            InfoText = amIPainter
                ? () => <span className='canvas-info-text'>Начало хода. Рисовать будете <span className="special">ВЫ</span></span>
                : () => <span className='canvas-info-text'>Начало хода. Рисовать будет <span className="special">{currentPainterName}</span></span>
            break
        }
        case GameState.EndOfTurn: {
            InfoText = !roundWinnerName
                ? () => <span className='canvas-info-text'>Никто не угадал слово <span className="special">{currentWord}</span></span>
                : () =>
                    <span className='canvas-info-text'>
                        <span className="special">{roundWinnerName}</span> угадал слово <span className="special">{currentWord}</span>
                    </span>
            break
        }
        case GameState.EndOfGame: {
            InfoText = () => <span className='canvas-info-text'>Игра окончена. Победил <span className="special">{gameWinnerName}</span> !</span>
            break
        }
        default:
            break
    }

    return (
        <div className='canvas-container shadowed-block'>
            <div className='canvas-info'><InfoText /></div>
        </div>
    )
}

export default CanvasInfo