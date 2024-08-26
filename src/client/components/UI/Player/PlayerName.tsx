import Avatar from './Avatar'
import cl from './PlayerName.module.scss'

interface IPlayerName {
    name?: string,
    avatar?: number
}

const PlayerName: React.FC<IPlayerName> = ({ name, avatar }) => {
    return (
        <span className={cl.playerName}><Avatar avatarNumber={avatar} />{name}</span>
    )
}

export default PlayerName