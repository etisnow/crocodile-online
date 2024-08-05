import { useEffect } from 'react'

import GameRoom from './pages/GameRoom.tsx'
import LoginForm from './pages/LoginForm.tsx'
import { selectInGame } from './store/selectors.tsx'
import { useAppSelector } from './store/store.ts'

function App() {
    const inGame = useAppSelector(selectInGame)

    useEffect(() => {
        function undoHandler(event: KeyboardEvent): void {
            if ((event.key === '`') || (event.key === 'ё')) {
                event.preventDefault();
                const console = document.querySelector('.console');
                if (console && console instanceof HTMLElement) {
                    if (console.style.display === "none") {
                        console.style.display = "block";
                    } else {
                        console.style.display = "none";
                    }
                }
            }
        }
        document.addEventListener('keydown', undoHandler);
        return () => {
            document.removeEventListener('keydown', undoHandler);
        };
    }, [])


    return (
        <>
            {inGame ?
                <GameRoom />
                :
                <LoginForm />
            }
        </>
    )
}

export default App
