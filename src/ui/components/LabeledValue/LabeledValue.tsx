import styles from "./LabeledValue.module.css"

type LabeledValueProps = {
    label: string;
    value: string | number | undefined;
}

export default function LabeledValue({ label, value }: LabeledValueProps) {
    return (
        <div className={styles.root}>
            <span className={styles.label}>{label}</span>
            <div className={styles.value}>{value ?? "-"}</div>
        </div>
    )
}