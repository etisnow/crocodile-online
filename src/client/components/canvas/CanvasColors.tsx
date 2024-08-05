export enum Colors {
    black = 'black',
    green = 'green',
    brown = 'brown',
    yellow = 'yellow',
    blue = 'blue',
    red = 'red'
}

interface ICanvasColor {
    setActiveColor: (color: Colors) => void,
    activeColor: Colors
}

const CanvasColors: React.FC<ICanvasColor> = ({ activeColor, setActiveColor }) => {

    return (
        <div className="canvas-footer-colors">
            {(Object.values(Colors) as Array<Colors>).map((color) =>
                <div
                    className={`color-${color} ${(color === activeColor) ? `color-active` : ''}`}
                    onClick={() => setActiveColor(color)}
                    key={color}
                />
            )}
        </div>
    )
}

export default CanvasColors