import { useEffect } from "react"
import { GameState, setTimerAction, timerTickAction, useAppDispatch, useAppSelector } from "../../store/store"

const Timer = () => {
    const dispatch = useAppDispatch()
    const timer = useAppSelector((state) => state.room.timer)
    const gameState = useAppSelector((state) => state.room.gameState)

    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60;


    useEffect(() => {
        let timerInterval: number;
        if (gameState === GameState.Painting) {
            let internalCounter = timer;
            timerInterval = setInterval(() => {
                if (internalCounter > 0) {
                    dispatch(timerTickAction());
                    --internalCounter
                } else {
                    clearInterval(timerInterval)
                }
            }, 1000);
        }
        return () => {
            clearInterval(timerInterval);
            dispatch(setTimerAction(120))
        }
    }, [gameState]);


    return (
        <div className="canvas-timer">
            <span>{minutes}: {seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
    )
}

export default Timer