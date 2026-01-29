import styles from "./ContentBox.module.css";

export function ContentBox({ children }) {
    return <div className={styles.layout}>{children}</div>;
    
    <div className={styles.unitToggle}>
    <button
    className={unit === "metric" ? styles.active : ""}
    onClick={() => setUnit("metric")}
    >
    Metric
    </button>
    
    <button
    className={unit === "imperial" ? styles.active : ""}
    onClick={() => setUnit("imperial")}
    >
    Imperial
    </button>
    </div>
}
