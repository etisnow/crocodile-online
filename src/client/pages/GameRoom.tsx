import { useEffect } from 'react'
import Canvas from '../components/canvas/Canvas'
import Console from '../components/console/Console'
import SidePanel from '../components/sidePanel/SidePanel'
import { connect } from '../utils/requests'


function GameRoom() {

    useEffect(() => {
        connect()
    }, [])

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
