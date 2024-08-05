import React from 'react';


import CanvasHeader from './CanvasHeader';
import { useAppSelector } from '../../store/store';
import { selectCanvasData } from '../../store/selectors';

const CanvasGuesser: React.FC = () => {
    const canvasData = useAppSelector(selectCanvasData)

    return (
        <div className='canvas-container shadowed-block'>
            <CanvasHeader />
            <img src={canvasData} width='800px' height='705px' />
        </div>
    );
};

export default CanvasGuesser;