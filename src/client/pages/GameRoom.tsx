import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Canvas from '../components/canvas/Canvas'
import Console from '../components/console/Console'
import SidePanel from '../components/sidePanel/SidePanel'
import { useAppDispatch, useAppSelector } from '../store/store'
import { connect, login } from '../utils/requests'


function GameRoom() {
    const isLogged = useAppSelector((state) => state.player.isLogged)
    const error = useAppSelector((state) => state.error)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLogged) {
            dispatch(login())
        }
        const eventSource = connect()

        return () => eventSource.close()
    }, [])

    useEffect(() => {
        if (error) {
            navigate('/')
        }
    }, [error])

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
