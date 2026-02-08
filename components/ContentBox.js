import styles from "./ContentBox.module.css";

export function ContentBox({ children }) {
  return <div className={styles.layout}>{children}</div>;
}
