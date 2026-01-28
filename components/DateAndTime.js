import { getWeekDay, getTime, getAMPM } from "../services/helpers";
import styles from "./DateAndTime.module.css";

export function DateAndTime({ time }) {
  const date = new Date(time);

  return <p>{date.toLocaleString()}</p>;
}
