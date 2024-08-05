import PlayerDashboard from "./PlayerDashboard"
import Chat from "./Chat"

const SidePanel = () => {

    return (
        <div className='side-panel shadowed-block'>
            <PlayerDashboard />
            <Chat />
        </div>
    )
}

export default SidePanel