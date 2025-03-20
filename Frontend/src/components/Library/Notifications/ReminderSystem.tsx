import { useEffect } from "react";
import { sendReminder } from "../../../services/NotificationService";

export const ReminderSystem = ({ transactions, users }) => {
  useEffect(() => {
    const checkDueDates = () => {
      transactions.forEach((t) => {
        const user = users.find((u) => u.id === t.userId);
        if (isDueSoon(t.dueDate) && t.status === "Borrowed") {
          sendReminder(user, t);
        }
      });
    };

    const interval = setInterval(checkDueDates, 3600000); //check every hour
    return () => clearInterval(interval);
  }, [transactions, users]);

  return null;
};
