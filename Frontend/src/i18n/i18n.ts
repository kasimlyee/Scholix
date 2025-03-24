import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        dashboard: "Dashboard",
        overview: "Overview",
        students: "Students",
        teachers: "Teachers",
        staff: "Staff",
        notifications: "Notifications",
        upcoming_deadlines: "Upcoming Deadlines",
        logout: "Logout",
        settings: "Settings",
        change_password: "Change Password",
        edit_profile: "Edit Profile",
      },
    },
    sw: {
      translation: {
        dashboard: "Dashibodi",
        overview: "Muhtasari",
        students: "Wanafunzi",
        teachers: "Walimu",
        staff: "Wafanyakazi",
        notifications: "Taarifa",
        upcoming_deadlines: "Muda wa Mwisho Unaokaribia",
        logout: "Ondoka",
        settings: "Mipangilio",
        change_password: "Badilisha Nenosiri",
        edit_profile: "Hariri Profaili",
      },
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
