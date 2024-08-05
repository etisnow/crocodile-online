import { useAppSelector } from "../../store/store"

const PlayerDashboard: React.FC = () => {
    const playerList = useAppSelector((state) => state.room.playerList)
    return (
        <div className='players-list'>
            {playerList.map((player) =>
                <div className='player-node' key={player.name}>
                    <span className='player-name'>{player.name}</span>
                    <span className='player-score'>{player.score.toString()}</span>
                </div>
            )}
        </div>
    )
}

export default PlayerDashboard