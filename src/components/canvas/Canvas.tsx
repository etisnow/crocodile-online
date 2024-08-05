import React from 'react';
import { useAppSelector } from '../../store/store';
import { selectAmIPainter } from '../../store/selectors';
import CanvasPainter from './CanvasPainter';
import CanvasGuesser from './CanvasGuesser';


const Canvas: React.FC = () => {
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))

    return (
        <>
            {amIPainter ? <CanvasPainter /> : <CanvasGuesser />}
        </>
    );
};

export default Canvas;