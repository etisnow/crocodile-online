import { useEffect } from 'react'
import Canvas from '../components/canvas/Canvas'
import Console from '../components/console/Console'
import SidePanel from '../components/sidePanel/SidePanel'


function GameRoom() {

    useEffect(() => {
        //subscribe()
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
