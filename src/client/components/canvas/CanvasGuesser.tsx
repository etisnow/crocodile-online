import React from 'react';

import { useAppSelector } from '../../store/store';
import CanvasHeader from './CanvasHeader';

const CanvasGuesser: React.FC = () => {
    const canvasData = useAppSelector((state) => state.room.canvasData)

    return (
        <div className='canvas-container shadowed-block'>
            <CanvasHeader />
            <img src={canvasData} width='800px' height='705px' />
        </div>
    )
}

export default CanvasGuesser;