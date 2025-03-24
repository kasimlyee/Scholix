import { format } from "date-fns";
import { User, Transaction } from "../types/libraryTypes";
import axios from "axios";

export const sendReminder = async (user: User, transaction: Transaction) => {
  const message = `Reminder: ${transaction.book.title} is due on ${format(
    transaction.dueDate,
    "PP"
  )}`;

  switch (user.contact.preferences.notifications) {
    case "email":
      await sendEmail(user.email, message);
      break;

    case "sms":
      await sendSMS(user.contact.phone, message);
      break;

    case "push":
      sendPushNotification(user.id, message);
      break;
  }
};

export const sendEmail = async (email: string, content: string) => {
  //implementing email sending logic
};

export const sendSMS = async (phone: string, content: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/comm/sms`,
      { phone, content }
    );
    return response.status === 200 ? "sent" : "failed";
  } catch {
    return "failed";
  }
};

export const sendPushNotification = (userId: number, content: string) => {
  //implementing push notification logic
};
