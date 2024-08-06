import { useEffect } from 'react'
import Canvas from '../components/canvas/Canvas'
import Console from '../components/console/Console'
import SidePanel from '../components/sidePanel/SidePanel'
import { connect } from '../utils/requests'
import { GameState, useAppSelector } from '../store/store'
import { useNavigate } from 'react-router-dom'


function GameRoom() {

    const gameState = useAppSelector((state)=> state.room.gameState)
    const navigate = useNavigate()

    useEffect(() => {
        connect()
    }, [])

    useEffect(()=> {
        if (gameState === GameState.NotInGame) {
            navigate('/')
        }
    }, [gameState])

    return (

        <div className='main-container'>
            <div className='game-container'>
                <Canvas />
                <SidePanel />
                <Console />
            </div>
        </div>
    )
}

export default GameRoom
