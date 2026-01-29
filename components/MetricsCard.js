import styles from "./MetricsCard.module.css";

export function MetricsCard({ title, value, unit, icon }) {
  return (
    <div className={styles.card}>
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>
        {value} {unit || ""}
      </p>
    </div>
  );
}
