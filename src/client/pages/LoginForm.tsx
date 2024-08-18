import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/icon.png'
import Console from '../components/console/Console'
import Button from '../components/UI/Button/Button'
import { useUpdateEffect } from '../hooks/useUpdateEffect'
import { setRoomLink, useAppDispatch, useAppSelector } from '../store/store'
import { changeName, findGame, login } from '../utils/requests'


function LoginForm() {
    let preloadedName = useAppSelector((state) => state.player.preloadedName)
    const roomLink = useAppSelector((state) => state.room.link)
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
        dispatch(findGame())
    }

    return (

        <div className='main-container'>
            <div className='login-container shadowed-block'>
                <div className="logo"><img src={logo} /><span>Крокодил Онлайн</span></div>
                <div className="login-form">
                    <input type='text'
                        className='name-input'
                        placeholder='Введите имя'
                        value={preloadedName || name}
                        onChange={(e) => inputHandler(e)}
                        onKeyDown={(e) => loginByEnter(e)}
                    />
                    <Button onClick={() => findGameButtonHandler()}>Найти игру</Button>
                    <div className="error-message">{error}</div>
                </div>
            </div>
            <Console />
        </div>
    )
}

export default LoginForm
