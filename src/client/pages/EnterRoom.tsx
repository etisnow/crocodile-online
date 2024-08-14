import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/icon.png'
import Console from '../components/console/Console'
import Loader from '../components/login/Loader'
import { useUpdateEffect } from '../hooks/useUpdateEffect'
import { RoomValidationStatus, setRoomLink, useAppDispatch, useAppSelector } from '../store/store'
import { changeName, enterRoom, findGame, login } from '../utils/requests'


function EnterRoom() {
    let preloadedName = useAppSelector((state) => state.player.preloadedName)
    const roomLink = useAppSelector((state) => state.room.link)
    const validationStatus = useAppSelector((state) => state.room.validation)
    const [name, setName] = useState(preloadedName)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const error = useAppSelector((state) => state.error)

    useEffect(() => {
        dispatch(setRoomLink(''))
        dispatch(login())
    }, [])

    useUpdateEffect(() => {
        if (roomLink) {
            navigate(`/${roomLink}`)
        }
    }, [roomLink])

    const loginByEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            dispatch(findGame())
        }
    }

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        dispatch(changeName(e.target.value))
        preloadedName = ''
    }

    const findGameButtonHandler = () => {
        dispatch(enterRoom())
    }

    return (

        <div className='main-container'>
            <div className='login-container shadowed-block'>
                <div className="logo"><img src={logo} /><span>Крокодил Онлайн</span></div>
                {validationStatus === RoomValidationStatus.Pending ?
                    <Loader />
                    :
                    <>
                        <input type='text'
                            className='name-input'
                            placeholder='Введите имя'
                            value={preloadedName || name}
                            onChange={(e) => inputHandler(e)}
                            onKeyDown={(e) => loginByEnter(e)}
                        />
                        <button className="login-btn" onClick={() => findGameButtonHandler()}>Войти в игру</button>
                        <div className="error-message">{error}</div>
                    </>

                }

            </div>
            <Console />
        </div>
    )
}

export default EnterRoom
