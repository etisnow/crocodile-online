import { useEffect, useState } from "react"
import { useAppSelector } from "../../store/store"

const Timer = () => {
    const timerServerStamp = useAppSelector((state) => state.room.timerServerStamp)
    const [timer, setTimer] = useState(0)

    const minutes = Math.floor(timer / 60 / 1000)
    const seconds = Math.floor((timer / 1000) % 60)


    useEffect(() => {
        setTimer(timerServerStamp)
        let internalCounter = timerServerStamp;
        let timerInterval = setInterval(() => {
            if (internalCounter > 0) {
                setTimer((prev) => prev - 1000)
                internalCounter -= 1000
            } else {
                clearInterval(timerInterval)
            }
        }, 1000);
        return () => {
            clearInterval(timerInterval);
        }
    }, [timerServerStamp]);


    return (
        <div className="canvas-timer">
            <span>{minutes}: {seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
    )
}

export default Timer