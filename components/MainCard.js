import styles from "./MainCard.module.css";

export function MainCard({ temperature, windSpeed, time }) {
  const date = new Date(time);

  return (
    <div className={styles.card}>
      <h1 className={styles.temperature}>
        {Math.round(temperature)}°C
      </h1>

      <p>Wind: {Math.round(windSpeed)} km/h</p>
      <p>{date.toLocaleString()}</p>
    </div>
  );
}
