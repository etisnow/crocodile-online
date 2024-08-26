interface ISystemMessage {
    i: number,
    type: string,
    payload: string[]
}

export enum SystemMessageType {
    PLAYER_RECONNETED = 'PLAYER_RECONNETED',
    PLAYER_CONNETED = 'PLAYER_CONNETED',
    PLAYER_DISCONNETED = 'PLAYER_DISCONNETED',
    PLAYER_PAINTER = 'PLAYER_PAINTER',
    ROUND_BEGIN = 'ROUND_BEGIN',
    TIME_ENDED = 'TIME_ENDED',
    NOT_ENOUGH_PLAYERS = 'NOT_ENOUGH_PLAYERS',
    PLAYER_GUESSED_WORD = 'PLAYER_GUESSED_WORD',
    PLAYER_WON = 'PLAYER_WON'
}

const SystemMessage: React.FC<ISystemMessage> = ({ i, type, payload }) => {

    let Text: () => JSX.Element;

    switch (type) {
        case SystemMessageType.PLAYER_RECONNETED: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> вернулся в игру</span>
            break
        }
        case SystemMessageType.PLAYER_CONNETED: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> присоединился к игре</span>
            break
        }
        case SystemMessageType.PLAYER_DISCONNETED: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> покинул игру</span>
            break
        }
        case SystemMessageType.PLAYER_PAINTER: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> становится ведущим</span>
            break
        }
        case SystemMessageType.ROUND_BEGIN: {
            Text = () => <span>Время пошло!</span>
            break
        }
        case SystemMessageType.TIME_ENDED: {
            Text = () => <span>Время вышло. Никто не угадал слово <span className="red">{payload[0]}</span></span>
            break
        }
        case SystemMessageType.NOT_ENOUGH_PLAYERS: {
            Text = () => <span>Недостаточно игроков. Игра поставлена на <span className="yellow">паузу</span></span>
            break
        }
        case SystemMessageType.PLAYER_GUESSED_WORD: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> угадал слово <span className="red">{payload[1]}</span></span>
            break
        }
        case SystemMessageType.PLAYER_WON: {
            Text = () => <span>Игрок <span className="yellow">{payload[0]}</span> набирает <span className="yellow">{payload[1]}</span> побеждает в игре</span>
            break
        }
        default:
            Text = () => <></>
            break
    }

    return (
        <div className="chat-message-system" key={i}>
            <span className="chat-message-body"><Text /></span>
        </div>
    )
}

export default SystemMessage