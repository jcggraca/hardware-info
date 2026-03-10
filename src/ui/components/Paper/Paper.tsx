import type { ReactNode } from "react"
import styles from "./Paper.module.css"

type PaperProps = {
    children: ReactNode
}

export default function Paper({ children }: PaperProps) {
    return (
        <div className={styles.root}>
            {children}
        </div>
    )
}