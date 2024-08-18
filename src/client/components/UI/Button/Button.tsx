import { ReactNode } from "react"
import styles from './Button.module.scss'

interface IButton {
    children: ReactNode,
    onClick: () => void
}

const Button: React.FC<IButton> = ({ children, onClick }) => {
    return (
        <button className={styles.greenButton} onClick={() => onClick()}>{children}</button>
    )
}

export default Button