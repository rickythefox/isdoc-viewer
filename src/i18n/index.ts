import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import cs from "./locales/cs.json";
import en from "./locales/en.json";

// Get saved language or default to Czech
const savedLang = localStorage.getItem("i18n-lang") || "cs";

i18n.use(initReactI18next).init({
  resources: {
    cs: { translation: cs },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "cs",
  interpolation: {
    escapeValue: false,
  },
});

// Helper to get current locale for date formatting
export const getDateLocale = (): string => {
  return i18n.language === "en" ? "en-GB" : "cs-CZ";
};

export default i18n;
