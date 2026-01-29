import { getWeekDay, getTime, getAMPM } from "../services/helpers";
import styles from "./DateAndTime.module.css";

export function DateAndTime() {
    const now = new Date()
    
  return (
    <p>
        {now.toLocaleDateString()}{" "}
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </p>
  );
}
