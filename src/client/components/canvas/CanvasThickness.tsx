export const Thickness = {
    thin: 2,
    normal: 4,
    bold: 6
}

export type ThicknessName = keyof typeof Thickness;

interface ICanvasThickness {
    activeThickness: keyof typeof Thickness,
    setActiveThickness: (thickness: ThicknessName) => void
}

const CanvasThickness: React.FC<ICanvasThickness> = ({ activeThickness, setActiveThickness }) => {
    return (
        <div className="footer-thickness">
            {(Object.keys(Thickness) as Array<ThicknessName>).map((thickness) => {

                return (<div
                    className={`thickness-${thickness} ${(thickness === activeThickness) ? `thickness-active` : ''}`}
                    onClick={() => setActiveThickness(thickness)}
                    key={thickness}
                />)
            }
            )}
        </div>
    )
}

export default CanvasThickness