import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Canvas from '../components/canvas/Canvas'
import Console from '../components/console/Console'
import SidePanel from '../components/sidePanel/SidePanel'
import { RoomValidationStatus, useAppDispatch, useAppSelector } from '../store/store'
import { connect, enterRoom, login } from '../utils/requests'
import EnterRoom from './EnterRoom'


function GameRoom() {
    const isLogged = useAppSelector((state) => state.player.isLogged)
    const error = useAppSelector((state) => state.error)
    const roomValidation = useAppSelector((state) => state.room.validation)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLogged) {
            dispatch(login())
        } else {
            dispatch(enterRoom())
        }
    }, [isLogged])

    useEffect(() => {
        let eventSource: any
        if (roomValidation === RoomValidationStatus.Sucsess) {
            eventSource = connect()
        }

        return () => {
            if (roomValidation === RoomValidationStatus.Sucsess) {
                eventSource.close()
            }
        }
    }, [roomValidation])

    useEffect(() => {
        if (error) {
            navigate('/')
        }
    }, [error])

    return (
        (roomValidation === RoomValidationStatus.Error)
            ?
            <EnterRoom />
            :
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
