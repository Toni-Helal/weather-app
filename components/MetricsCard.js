import Image from "next/image";
import styles from "./MetricsCard.module.css";

export function MetricsCard({ title, value, unit, icon }) {
  return (
    <div className={styles.card}>
      {icon && (
        <Image src={icon} alt="" width={48} height={48} className={styles.icon} />
      )}
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>
        {value} {unit || ""}
      </p>
    </div>
  );
}
