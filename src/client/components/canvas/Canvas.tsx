import React from 'react';
import { selectAmIPainter, selectIsPainting } from '../../store/selectors';
import { useAppSelector } from '../../store/store';
import CanvasGuesser from './CanvasGuesser';
import CanvasInfo from './CanvasInfo';
import CanvasPainter from './CanvasPainter';


const Canvas: React.FC = () => {
    const amIPainter = useAppSelector((state) => selectAmIPainter(state))
    const isPainting = useAppSelector((state) => selectIsPainting(state))
    return (
        <>
            {
                isPainting
                    ? amIPainter ? <CanvasPainter /> : <CanvasGuesser />
                    : <CanvasInfo />
            }
        </>
    );
};

export default Canvas;