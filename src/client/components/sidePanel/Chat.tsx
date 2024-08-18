import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { MAX_MESSAGE_LENGTH } from "../../../shared/settings.ts"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { sendMessage } from "../../utils/requests"


const Chat = () => {
    const messageList = useAppSelector((state) => state.room.messages)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const myPlayerData = useAppSelector((state) => state.player);
    const dispatch = useAppDispatch()

    useEffect(() => {
        const chatWindow = document.querySelector('.chat-messages')
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [messageList])


    const addMessage = (text: string) => {
        if (!text) return
        if (myPlayerData.id !== null) {
            setInputValue('')
            inputRef.current?.focus()
            dispatch(sendMessage(text))
        }
    }

    const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
            setInputValue(e.target.value)
        }
    }

    const sentMessageByEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            addMessage(inputValue)
        }
    }

    const messageOutput = messageList.map((message, i) => {
        if (message.systemText) {
            return (
                <div className="chat-message-system" key={i}>
                    <span className="chat-message-author">{message.authorName} </span>
                    <span className="chat-message-body">{message.systemText[0].words}</span>
                </div>
            )
        } else if (message.commonText) {
            return (
                <div className="chat-message" key={i}>
                    <span className="chat-message-author">{message.authorName}: </span>
                    <span className="chat-message-body">{message.commonText}</span>
                </div>
            )
        } else if (message.matchedWord) {
            return (
                <div className="chat-message" key={i}>
                    <span className="chat-message-author">{message.authorName}: </span>
                    <span className="chat-message-body matched-word">{message.matchedWord.map((element) => {
                        let matchClass = ''
                        if (element.match === 'exact') matchClass = 'match-exact'
                        else if (element.match === 'weak') matchClass = 'match-weak'
                        else matchClass = 'match-not'
                        return <span className={matchClass}>{element.char}</span>
                    }

                    )}</span>
                </div>
            )

        }
    })

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                {messageOutput}
            </div>
            <div className='chat-form'>
                <input
                    className='chat-form-input'
                    type='text'
                    placeholder='Введите ответ...'
                    onChange={(e) => handleInputOnChange(e)}
                    value={inputValue}
                    onKeyDown={(e) => sentMessageByEnter(e)}
                    ref={inputRef}
                />
                <button className='chat-form-btn' onClick={() => addMessage(inputValue)}>{'>>'}</button>
            </div>
        </div>
    )
}

export default Chat