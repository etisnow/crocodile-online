import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import ClearIcon from '../../assets/clear.svg';
import UndoIcon from '../../assets/undo.svg';
import { useAppDispatch } from '../../store/store';
import { sendCanvasData } from '../../utils/requests';
import CanvasColors, { Colors } from './CanvasColors';
import CanvasHeader from './CanvasHeader';
import CanvasThickness, { Thickness, ThicknessName } from './CanvasThickness';

interface Point {
    x: number;
    y: number,
    color: Colors
    thickness: ThicknessName
}

type Line = Point[];


const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 705

const CanvasPainter: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);
    const [activeColor, setActiveColor] = useState<Colors>(Colors.black);
    const [activeThickness, setActiveThickness] = useState<ThicknessName>('normal')
    const throttleInProgress = useRef(false)

    const dispatch = useAppDispatch()
    const sendCanvasThrottled = () => {
        if (throttleInProgress.current) { return; }
        throttleInProgress.current = true;
        setTimeout(() => {
            const canvas = canvasRef.current;
            dispatch(sendCanvasData(canvas?.toDataURL()))
            throttleInProgress.current = false;
        }, 300);
    }

    useEffect(() => {
        function undoHandler(event: KeyboardEvent): void {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'я')) {
                event.preventDefault();
                undoLastLines();
            }
        }
        document.addEventListener('keydown', undoHandler);
        return () => {
            document.removeEventListener('keydown', undoHandler);
        };
    }, [lines])



    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
                context.lineCap = 'round'
                context.lineJoin = 'round'

                // Отрисовка линий из состояния
                lines.forEach(line => {
                    context.beginPath();
                    context.strokeStyle = line[0].color
                    const thicknessValue = line[0].thickness
                    context.lineWidth = Thickness[thicknessValue]
                    context.moveTo(line[0].x, line[0].y)
                    for (let i = 1; i < line.length; i++) {
                        context.lineTo(line[i].x, line[i].y)
                    }
                    context.stroke();
                });
                sendCanvasThrottled()
            }
        }
    }, [lines]);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        setDrawing(true);
        setLines([...lines, [{ x: offsetX, y: offsetY, color: activeColor, thickness: activeThickness }]]);
        console.log(lines);

    };

    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const newLines = [...lines];
        newLines[newLines.length - 1].push({ x: offsetX, y: offsetY, color: activeColor, thickness: activeThickness });
        setLines(newLines);
    };

    const finishDrawing = () => {
        setDrawing(false);
    };

    const undoLastLines = (): void => {
        if (lines) {
            setLines([...lines].slice(0, -1))
        }
    }

    const clearCanvas = () => {
        setLines([]);
    }

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        if (e.button === 0) {
            startDrawing(e)
        }
    }

    return (
        <div className='canvas-container shadowed-block'>
            <CanvasHeader />
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
                onKeyDown={(e) => console.log(e.key)}
                width={`${CANVAS_WIDTH}px`}
                height={`${CANVAS_HEIGHT}px`}
            />
            <div className="canvas-footer">
                <CanvasColors activeColor={activeColor} setActiveColor={setActiveColor} />
                <div className="footer-actions">
                    <button className="footer-actions-undo" onClick={undoLastLines}><img src={UndoIcon} /></button>
                    <button className="footer-actions-clear" onClick={clearCanvas}><img src={ClearIcon} /></button>
                </div>
                <CanvasThickness activeThickness={activeThickness} setActiveThickness={setActiveThickness} />
            </div>
            {/* <img src={canvasURL} width='500px' height='500px' /> */}
        </div>
    );
};

export default CanvasPainter;