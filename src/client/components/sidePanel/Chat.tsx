import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { selectSelfPlayerData } from "../../store/selectors"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { sendMessage } from "../../utils/requests"



const Chat = () => {
    const messageList = useAppSelector((state) => state.room.messages)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const myPlayerData = useAppSelector(selectSelfPlayerData)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const chatWindow = document.querySelector('.chat-messages')
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [messageList])


    const addMessage = (text: string) => {
        if (!text) return
        const message = { authorId: myPlayerData.id, authorName: myPlayerData.name, body: text }
        // dispatch(addMessageAction(message))
        setInputValue('')
        inputRef.current?.focus()
        dispatch(sendMessage(message))
    }

    const sentMessageByEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            addMessage(inputValue)
        }
    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                {messageList.map((message, i) =>
                    <div className="chat-message" key={i}>
                        <span className="chat-message-author">{message.authorName}: </span>
                        <span className="chat-message-body">{message.body}</span>
                    </div>
                )}
            </div>
            <div className='chat-form'>
                <input
                    className='chat-form-input'
                    type='text'
                    placeholder='Введите ответ...'
                    onChange={(e) => setInputValue(e.target.value)}
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