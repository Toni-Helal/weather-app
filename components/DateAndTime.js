import { getWeekDay, getTime, getAMPM } from "../services/helpers";
import styles from "./DateAndTime.module.css";

export function DateAndTime({ time }) {
  return (
    <div>
      <p>{new Date(time).toLocaleString()}</p>
    </div>
  );
}
