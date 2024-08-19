import { useAppSelector } from "../../store/store"

const PlayerDashboard: React.FC = () => {
    const playerList = useAppSelector((state) => state.room.playerList)
    const myId = useAppSelector((state) => state.player.id)
    const currentPainerId = useAppSelector((state) => state.room.currentPainterId)

    const playerListSorted = [...playerList].sort((a, b) => b.score - a.score)

    return (
        <div className='players-list'>
            {playerListSorted.map((player) =>
                <div
                    className={
                        `player-node 
                        ${(myId === player.id) ? 'my-name' : ''} 
                        ${(currentPainerId === player.id) ? 'painter' : ''}`
                    }
                    key={player.id}
                >
                    <span className='player-name'>{player.name}</span>
                    <span className='player-score'>{player.score.toString()}</span>
                </div>
            )}
        </div>
    )
}

export default PlayerDashboard